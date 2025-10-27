import React, { useEffect, useState } from 'react';
import { SparklesIcon } from './Icons';

interface LoaderProps {
  message?: string;
  subMessage?: string;
  progress?: number; // 0-100
}

const progressMessages = [
  "Analyzing your room layout...",
  "Understanding your design vision...",
  "Generating design concepts...",
  "Applying AI magic...",
  "Finalizing your new design...",
];

export const Loader: React.FC<LoaderProps> = ({ 
  message = "Designing your room...", 
  subMessage = "This can take a moment.",
  progress
}) => {
  const [, setCurrentMessageIndex] = useState(0);
  const [displayMessage, setDisplayMessage] = useState(progressMessages[0]);

  useEffect(() => {
    if (progress !== undefined) {
      const messageIndex = Math.min(
        Math.floor((progress / 100) * progressMessages.length),
        progressMessages.length - 1
      );
      setCurrentMessageIndex(messageIndex);
      setDisplayMessage(progressMessages[messageIndex]);
    } else {
      // Auto-cycle through messages if no progress is provided
      const interval = setInterval(() => {
        setCurrentMessageIndex((prev) => {
          const next = (prev + 1) % progressMessages.length;
          setDisplayMessage(progressMessages[next]);
          return next;
        });
      }, 2000);

      return () => clearInterval(interval);
    }
  }, [progress]);

  return (
    <div className="fixed inset-0 bg-white/80 dark:bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 max-w-sm w-full text-center border border-gray-200 dark:border-gray-700">
        {/* Main loader animation */}
        <div className="relative mb-6">
          <div className="w-20 h-20 mx-auto relative">
            {/* Outer ring */}
            <div className="absolute inset-0 border-4 border-violet-200 dark:border-violet-800 rounded-full animate-pulse" />
            
            {/* Spinning ring */}
            <div className="absolute inset-0 border-4 border-transparent border-t-violet-500 border-r-violet-500 rounded-full animate-spin" />
            
            {/* Inner sparkle */}
            <div className="absolute inset-0 flex items-center justify-center">
              <SparklesIcon className="w-8 h-8 text-violet-500 animate-pulse" />
            </div>
          </div>
          
          {/* Progress bar */}
          {progress !== undefined && (
            <div className="mt-4 w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-violet-500 to-purple-600 h-2 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${Math.min(progress, 100)}%` }}
              />
            </div>
          )}
        </div>

        {/* Messages */}
        <div className="space-y-2">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
            {message}
          </h3>
          
          <p className="text-violet-600 dark:text-violet-400 font-medium transition-opacity duration-300">
            {displayMessage}
          </p>
          
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            {subMessage}
          </p>

          {progress !== undefined && (
            <p className="text-gray-400 dark:text-gray-500 text-xs mt-3">
              {progress}% complete
            </p>
          )}
        </div>

        {/* Animated dots */}
        <div className="flex justify-center mt-6 space-x-1">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-2 h-2 bg-violet-400 rounded-full animate-pulse"
              style={{
                animationDelay: `${i * 0.2}s`,
                animationDuration: '1s',
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
