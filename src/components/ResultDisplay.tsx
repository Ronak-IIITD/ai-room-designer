import React, { useState } from 'react';
import { SparklesIcon, DownloadIcon, ShareIcon } from './Icons';

interface ResultDisplayProps {
  originalImage: string | null;
  generatedImage: string | null;
  onRetry?: () => void;
}

const ImagePanel: React.FC<{ 
  title: string; 
  imageUrl: string | null; 
  children?: React.ReactNode;
  showActions?: boolean;
  onDownload?: () => void;
  onShare?: () => void;
}> = ({ title, imageUrl, children, showActions = false, onDownload, onShare }) => {
  const [isFullscreen, setIsFullscreen] = useState(false);

  const handleImageClick = () => {
    if (imageUrl) {
      setIsFullscreen(true);
    }
  };

  return (
    <>
      <div className="w-full">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-slate-900 dark:text-slate-200 font-display">{title}</h3>
          {showActions && imageUrl && (
            <div className="flex gap-2">
              <button
                onClick={onDownload}
                className="flex items-center gap-2 px-4 py-2 text-sm bg-accent-100 hover:bg-accent-200 dark:bg-accent-900/30 dark:hover:bg-accent-900/50 text-accent-700 dark:text-accent-300 rounded-xl transition-all duration-300 font-medium hover:scale-105 shadow-sm hover:shadow-md backdrop-blur-sm"
                title="Download image"
              >
                <DownloadIcon className="w-4 h-4" />
                Download
              </button>
              <button
                onClick={onShare}
                className="flex items-center gap-2 px-4 py-2 text-sm bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl transition-all duration-300 font-medium hover:scale-105 shadow-sm hover:shadow-md backdrop-blur-sm"
                title="Share image"
              >
                <ShareIcon className="w-4 h-4" />
                Share
              </button>
            </div>
          )}
        </div>
        
        <div className="aspect-video bg-gradient-to-br from-slate-100 to-slate-50 dark:from-slate-800/50 dark:to-slate-900/50 border border-slate-200/60 dark:border-slate-700/60 rounded-2xl flex items-center justify-center overflow-hidden group relative shadow-lg backdrop-blur-sm">
          {imageUrl ? (
            <>
              <img 
                src={imageUrl} 
                alt={title} 
                className="w-full h-full object-contain cursor-pointer transition-all duration-500 group-hover:scale-105" 
                onClick={handleImageClick}
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-all duration-300 cursor-pointer flex items-center justify-center" onClick={handleImageClick}>
                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm px-4 py-2 rounded-xl text-sm font-medium text-slate-700 dark:text-slate-300 shadow-lg">
                  Click to view fullscreen
                </div>
              </div>
            </>
          ) : (
            children
          )}
        </div>
      </div>

      {/* Fullscreen modal */}
      {isFullscreen && imageUrl && (
        <div 
          className="fixed inset-0 bg-black/95 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in"
          onClick={() => setIsFullscreen(false)}
        >
          <div className="relative max-w-full max-h-full animate-scale-in">
            <img 
              src={imageUrl} 
              alt={title} 
              className="max-w-full max-h-full object-contain rounded-2xl shadow-2xl"
            />
            <button
              onClick={() => setIsFullscreen(false)}
              className="absolute top-4 right-4 text-white bg-black/60 hover:bg-black/80 backdrop-blur-sm rounded-xl p-3 transition-all duration-300 hover:scale-110 shadow-lg"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export const ResultDisplay: React.FC<ResultDisplayProps> = ({ originalImage, generatedImage, onRetry }) => {
  const handleDownloadOriginal = async () => {
    if (!originalImage) return;
    await downloadImage(originalImage, 'original-room.jpg');
  };

  const handleDownloadGenerated = async () => {
    if (!generatedImage) return;
    await downloadImage(generatedImage, 'ai-redesigned-room.jpg');
  };

  const handleShareGenerated = async () => {
    if (!generatedImage) return;
    
    try {
      if (navigator.share) {
        const response = await fetch(generatedImage);
        const blob = await response.blob();
        const file = new File([blob], 'ai-redesigned-room.jpg', { type: 'image/jpeg' });
        
        await navigator.share({
          title: 'My AI Room Design',
          text: 'Check out my AI-generated room design!',
          files: [file],
        });
      } else {
        // Fallback: copy to clipboard
        await copyImageToClipboard(generatedImage);
      }
    } catch (error) {
      console.error('Error sharing image:', error);
      // Fallback to download
      await handleDownloadGenerated();
    }
  };

  const downloadImage = async (imageUrl: string, filename: string) => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      link.click();
      
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading image:', error);
    }
  };

  const copyImageToClipboard = async (imageUrl: string) => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      await navigator.clipboard.write([
        new ClipboardItem({ [blob.type]: blob })
      ]);
      // You might want to show a toast notification here
    } catch (error) {
      console.error('Error copying image to clipboard:', error);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-bold text-slate-900 dark:text-slate-200 font-display">
        3. Admire Your New Space ✨
      </h2>
      
      <div className="space-y-8">
        {originalImage && (
          <ImagePanel 
            title="Original" 
            imageUrl={originalImage}
            onDownload={handleDownloadOriginal}
          />
        )}
        
        <ImagePanel 
          title="AI Redesigned" 
          imageUrl={generatedImage}
          showActions={!!generatedImage}
          onDownload={handleDownloadGenerated}
          onShare={handleShareGenerated}
        >
          <div className="text-center text-slate-500 dark:text-slate-500 p-8">
            <div className="relative inline-block mb-4">
              <SparklesIcon className="w-16 h-16 mx-auto text-accent-300 dark:text-accent-700 animate-pulse"/>
              <div className="absolute inset-0 bg-accent-500/20 blur-2xl animate-pulse" />
            </div>
            <p className="font-bold text-lg mb-3 text-slate-700 dark:text-slate-400">Your generated design will appear here</p>
            <p className="text-sm text-slate-500 dark:text-slate-600 max-w-md mx-auto leading-relaxed">
              Upload an image and describe your vision to get started with AI-powered room redesign
            </p>
            {onRetry && (
              <button
                onClick={onRetry}
                className="mt-4 text-violet-500 hover:text-violet-600 dark:text-violet-400 dark:hover:text-violet-300 text-sm underline transition-colors"
              >
                Try a different design
              </button>
            )}
          </div>
        </ImagePanel>
      </div>
      
      {generatedImage && (
        <div className="bg-green-50/80 dark:bg-green-950/20 backdrop-blur-sm border border-green-200 dark:border-green-800 rounded-xl p-5 shadow-md animate-slide-up">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0">
              <SparklesIcon className="w-5 h-5 text-green-500 mt-0.5" />
            </div>
            <div className="flex-1">
              <h4 className="font-medium text-green-900 dark:text-green-100 mb-1">
                Design Complete!
              </h4>
              <p className="text-green-700 dark:text-green-300 text-sm">
                Your AI-generated room design is ready. You can download it, share it, or try generating a new variation.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
