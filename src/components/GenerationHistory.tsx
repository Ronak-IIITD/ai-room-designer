import React, { useState, useEffect } from 'react';
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore';
import { db } from '../services/firebase';
import { SparklesIcon, DownloadIcon, XCircleIcon } from './Icons';

interface Generation {
  id: string;
  prompt: string;
  generatedImageUrl: string;
  originalImageUrl?: string;
  createdAt: Date;
}

interface GenerationHistoryProps {
  userId: string;
  onSelectGeneration?: (generation: Generation) => void;
  onClose: () => void;
}

export const GenerationHistory: React.FC<GenerationHistoryProps> = ({
  userId,
  onSelectGeneration,
  onClose,
}) => {
  const [generations, setGenerations] = useState<Generation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const fetchGenerations = async () => {
      try {
        setLoading(true);
        const q = query(
          collection(db, 'users', userId, 'generations'),
          orderBy('createdAt', 'desc'),
          limit(20)
        );
        
        const snapshot = await getDocs(q);
        const gens = snapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            prompt: data.prompt,
            generatedImageUrl: data.generatedImageUrl,
            originalImageUrl: data.originalImageUrl,
            createdAt: data.createdAt?.toDate() || new Date(),
          };
        });
        
        setGenerations(gens);
      } catch (err) {
        console.error('Error fetching generations:', err);
        setError('Failed to load your generation history');
      } finally {
        setLoading(false);
      }
    };

    fetchGenerations();
  }, [userId]);

  const handleDownload = async (imageUrl: string, filename: string) => {
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

  const formatDate = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days === 0) return 'Today';
    if (days === 1) return 'Yesterday';
    if (days < 7) return `${days} days ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-slate-900 rounded-xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-700">
          <div className="flex items-center gap-3">
            <SparklesIcon className="w-6 h-6 text-violet-500" />
            <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
              Generation History
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            aria-label="Close"
          >
            <XCircleIcon className="w-6 h-6 text-slate-500" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="w-12 h-12 border-4 border-violet-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-red-500">{error}</p>
            </div>
          ) : generations.length === 0 ? (
            <div className="text-center py-12">
              <SparklesIcon className="w-16 h-16 mx-auto text-slate-300 dark:text-slate-700 mb-4" />
              <p className="text-slate-500 dark:text-slate-400">
                No generations yet. Create your first design to see it here!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {generations.map((gen) => (
                <div
                  key={gen.id}
                  className="group relative bg-slate-50 dark:bg-slate-800 rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700 hover:border-violet-400 dark:hover:border-violet-500 transition-all cursor-pointer"
                  onClick={() => onSelectGeneration?.(gen)}
                >
                  {/* Image */}
                  <div className="aspect-video bg-slate-200 dark:bg-slate-700">
                    <img
                      src={gen.generatedImageUrl}
                      alt={gen.prompt}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                  </div>

                  {/* Info */}
                  <div className="p-3">
                    <p className="text-sm text-slate-700 dark:text-slate-300 line-clamp-2 mb-2">
                      {gen.prompt}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-slate-500 dark:text-slate-400">
                        {formatDate(gen.createdAt)}
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDownload(gen.generatedImageUrl, `design-${gen.id}.jpg`);
                        }}
                        className="p-1 hover:bg-slate-200 dark:hover:bg-slate-700 rounded transition-colors"
                        aria-label="Download"
                      >
                        <DownloadIcon className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
