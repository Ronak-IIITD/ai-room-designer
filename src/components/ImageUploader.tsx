import React, { useRef, useState, useCallback } from 'react';
import { UploadIcon, XCircleIcon, CheckCircleIcon } from './Icons';
import { validateFile, compressImage, formatFileSize, extractImageDimensions } from '../utils/fileUtils';

interface ImageUploaderProps {
  onImageChange: (file: File | null) => void;
  imagePreviewUrl: string | null;
  isProcessing?: boolean;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageChange, imagePreviewUrl, isProcessing = false }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);
  const [isCompressing, setIsCompressing] = useState(false);
  const [error, setError] = useState<string>('');
  const [fileInfo, setFileInfo] = useState<{ name: string; size: string; dimensions?: string } | null>(null);

  const processFile = useCallback(async (file: File) => {
    setError('');
    setIsCompressing(true);

    try {
      // Validate file
      const validation = validateFile(file);
      if (!validation.isValid) {
        setError(validation.error || 'Invalid file');
        setIsCompressing(false);
        return;
      }

      // Get image dimensions
      const dimensions = await extractImageDimensions(file);
      
      // Compress image if it's too large
      let processedFile = file;
      if (file.size > 5 * 1024 * 1024 || dimensions.width > 2048 || dimensions.height > 2048) {
        processedFile = await compressImage(file, 2048, 2048, 0.85);
      }

      // Set file info
      setFileInfo({
        name: processedFile.name,
        size: formatFileSize(processedFile.size),
        dimensions: `${dimensions.width} × ${dimensions.height}px`
      });

      onImageChange(processedFile);
    } catch (err) {
      console.error('File processing error:', err);
      setError(err instanceof Error ? err.message : 'Failed to process image');
    } finally {
      setIsCompressing(false);
    }
  }, [onImageChange]);

  const handleFileChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      processFile(file);
    }
  }, [processFile]);

  const handleButtonClick = useCallback(() => {
    if (isProcessing || isCompressing) return;
    fileInputRef.current?.click();
  }, [isProcessing, isCompressing]);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (isProcessing || isCompressing) return;

    const file = e.dataTransfer.files?.[0];
    if (file) {
      processFile(file);
    }
  }, [processFile, isProcessing, isCompressing]);

  const handleRemoveImage = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    onImageChange(null);
    setFileInfo(null);
    setError('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, [onImageChange]);

  const getDropzoneClasses = () => {
    let classes = "relative w-full aspect-video border-2 border-dashed rounded-2xl flex flex-col justify-center items-center text-center p-6 transition-all duration-300 backdrop-blur-sm ";
    
    if (error) {
      classes += "border-red-300 dark:border-red-700 bg-red-50/80 dark:bg-red-950/20 ";
    } else if (dragActive) {
      classes += "border-accent-500 bg-accent-50/80 dark:bg-accent-950/20 shadow-lg scale-[1.02] ";
    } else if (imagePreviewUrl) {
      classes += "border-green-400 dark:border-green-600 bg-green-50/50 dark:bg-green-950/20 ";
    } else {
      classes += "border-slate-300/60 dark:border-slate-700/60 bg-white/40 dark:bg-slate-800/40 hover:border-accent-400 hover:bg-accent-50/40 dark:hover:bg-accent-950/10 hover:shadow-md ";
    }
    
    if (!isProcessing && !isCompressing) {
      classes += "cursor-pointer ";
    }
    
    return classes;
  };

  return (
    <div className="space-y-4">
      <label className="block text-lg font-semibold text-slate-900 dark:text-slate-200 font-display">
        1. Upload Your Room Photo
      </label>
      
      <div 
        className={getDropzoneClasses()}
        onClick={handleButtonClick}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            handleButtonClick();
          }
        }}
        aria-label="Upload room image"
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
          accept="image/png, image/jpeg, image/webp"
          disabled={isProcessing || isCompressing}
          aria-describedby="file-upload-description"
        />
        
        {imagePreviewUrl ? (
          <>
            <img 
              src={imagePreviewUrl} 
              alt="Room preview" 
              className="absolute inset-0 w-full h-full object-contain rounded-lg"
            />
            <button
              onClick={handleRemoveImage}
              className="absolute top-3 right-3 p-2 bg-red-500 hover:bg-red-600 text-white rounded-xl transition-all duration-300 z-10 shadow-lg hover:scale-110"
              aria-label="Remove image"
              type="button"
            >
              <XCircleIcon className="w-5 h-5" />
            </button>
          </>
        ) : (
          <>
            {isCompressing ? (
              <>
                <div className="w-12 h-12 border-4 border-accent-500 border-t-transparent rounded-full animate-spin mb-3" />
                <p className="text-accent-600 dark:text-accent-400 font-semibold text-lg">Compressing image...</p>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">Optimizing for best results</p>
              </>
            ) : (
              <>
                <UploadIcon className={`w-12 h-12 mb-4 transition-all duration-300 ${dragActive ? 'text-accent-500 scale-110' : 'text-slate-400 dark:text-slate-500'}`} />
                <p className="text-slate-600 dark:text-slate-400 text-lg mb-2">
                  <span className="font-bold text-accent-600 dark:text-accent-400">
                    {dragActive ? 'Drop your image here' : 'Click to upload'}
                  </span>
                  {!dragActive && ' or drag and drop'}
                </p>
                <p className="text-sm text-slate-500 dark:text-slate-500 mt-2" id="file-upload-description">
                  PNG, JPG, or WEBP • Max 10MB • Auto-compressed for optimal quality
                </p>
              </>
            )}
          </>
        )}
      </div>

      {error && (
        <div className="flex items-start gap-3 p-4 bg-red-50/80 dark:bg-red-950/20 backdrop-blur-sm border border-red-200 dark:border-red-800 rounded-xl shadow-sm">
          <XCircleIcon className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-red-800 dark:text-red-200 font-medium">Upload Error</p>
            <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
          </div>
        </div>
      )}

      {fileInfo && imagePreviewUrl && (
        <div className="flex items-center gap-3 p-4 bg-green-50/80 dark:bg-green-950/20 backdrop-blur-sm border border-green-200 dark:border-green-800 rounded-xl shadow-sm animate-slide-up">
          <CheckCircleIcon className="w-5 h-5 text-green-500 flex-shrink-0" />
          <div className="flex-1">
            <p className="text-green-800 dark:text-green-200 font-medium text-sm">Image uploaded successfully</p>
            <p className="text-green-600 dark:text-green-400 text-xs">
              {fileInfo.name} • {fileInfo.size}{fileInfo.dimensions && ` • ${fileInfo.dimensions}`}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
