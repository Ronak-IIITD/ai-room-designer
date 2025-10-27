import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-white/40 dark:bg-dark-surface/40 backdrop-blur-md border-t border-slate-200/50 dark:border-slate-700/50 mt-16">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-center md:text-left">
            <p className="text-slate-600 dark:text-slate-400 text-sm">
              &copy; {new Date().getFullYear()} <span className="font-semibold gradient-text">AI Room Designer</span>. All Rights Reserved.
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-500 mt-1">
              Powered by Advanced AI Technology
            </p>
          </div>
          
          <div className="flex items-center gap-6">
            <a 
              href="#" 
              className="text-sm text-slate-600 dark:text-slate-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors duration-300 font-medium"
            >
              Privacy
            </a>
            <a 
              href="#" 
              className="text-sm text-slate-600 dark:text-slate-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors duration-300 font-medium"
            >
              Terms
            </a>
            <a 
              href="#" 
              className="text-sm text-slate-600 dark:text-slate-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors duration-300 font-medium"
            >
              Contact
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};