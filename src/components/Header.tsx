import React, { useState, useRef, useEffect } from 'react';
import { User } from 'firebase/auth';
import { SparklesIcon, SunIcon, MoonIcon } from './Icons';

interface HeaderProps {
    onGoHome: () => void;
    theme: 'light' | 'dark';
    toggleTheme: () => void;
    isLandingPage: boolean;
  user: User | null;
  authLoading: boolean;
  onSignIn: () => Promise<unknown>;
  onSignOut: () => Promise<void>;
  onShowHistory?: () => void;
  onShowShortcuts?: () => void;
}

const ThemeSwitcher: React.FC<Pick<HeaderProps, 'theme' | 'toggleTheme'>> = ({ theme, toggleTheme }) => (
    <button 
        onClick={toggleTheme} 
        className="p-2.5 rounded-xl bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm hover:bg-white/80 dark:hover:bg-slate-700/80 transition-all duration-300 border border-slate-200/50 dark:border-slate-700/50 hover:scale-110 shadow-sm hover:shadow-md" 
        aria-label="Toggle theme"
    >
        {theme === 'light' ? <MoonIcon className="w-5 h-5 text-slate-700" /> : <SunIcon className="w-5 h-5 text-yellow-400" />}
    </button>
);

interface AuthControlsProps {
  user: User | null;
  authLoading: boolean;
  onSignIn: () => Promise<unknown>;
  onSignOut: () => Promise<void>;
  onShowHistory?: () => void;
  onShowShortcuts?: () => void;
}

const AuthControls: React.FC<AuthControlsProps> = ({ 
  user, 
  authLoading, 
  onSignIn, 
  onSignOut,
  onShowHistory,
  onShowShortcuts,
}) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  if (authLoading) {
    return (
      <span className="text-sm text-slate-500 dark:text-slate-400" role="status">
        Connecting...
      </span>
    );
  }

  if (!user) {
    return (
      <button
        onClick={() => void onSignIn()}
        className="btn-glass text-sm px-4 py-2 hover:scale-105"
      >
        Sign in with Google
      </button>
    );
  }

  const initials = user.displayName?.charAt(0)?.toUpperCase() ?? user.email?.charAt(0)?.toUpperCase() ?? 'U';

  return (
    <div className="relative flex items-center gap-3" ref={dropdownRef}>
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className="flex items-center gap-2 hover:opacity-80 transition-opacity"
      >
        {user.photoURL ? (
          <img
            src={user.photoURL}
            alt={user.displayName ?? 'User avatar'}
            className="w-8 h-8 rounded-full border border-slate-200 dark:border-slate-700"
          />
        ) : (
          <div className="w-8 h-8 rounded-full bg-primary-500/10 text-primary-600 dark:text-primary-300 flex items-center justify-center font-semibold border border-primary-300/40">
            {initials}
          </div>
        )}
        <svg
          className={`w-4 h-4 text-slate-500 transition-transform ${showDropdown ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {showDropdown && (
        <div className="absolute top-full right-0 mt-2 w-64 bg-white/95 dark:bg-slate-800/95 backdrop-blur-md rounded-xl shadow-xl border border-slate-200/50 dark:border-slate-700/50 py-2 animate-slide-down">
          <div className="px-4 py-3 border-b border-slate-200 dark:border-slate-700">
            <p className="text-sm font-medium text-slate-700 dark:text-slate-200">
              {user.displayName ?? 'User'}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
              {user.email}
            </p>
          </div>
          
          {onShowHistory && (
            <button
              onClick={() => {
                onShowHistory();
                setShowDropdown(false);
              }}
              className="w-full px-4 py-2.5 text-left text-sm text-slate-700 dark:text-slate-300 hover:bg-accent-50 dark:hover:bg-slate-700 transition-all duration-200 flex items-center gap-2 rounded-lg mx-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              View History
            </button>
          )}
          
          {onShowShortcuts && (
            <button
              onClick={() => {
                onShowShortcuts();
                setShowDropdown(false);
              }}
              className="w-full px-4 py-2.5 text-left text-sm text-slate-700 dark:text-slate-300 hover:bg-accent-50 dark:hover:bg-slate-700 transition-all duration-200 flex items-center gap-2 rounded-lg mx-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Keyboard Shortcuts
            </button>
          )}
          
          <div className="border-t border-slate-200 dark:border-slate-700 mt-2 pt-2">
            <button
              onClick={() => {
                void onSignOut();
                setShowDropdown(false);
              }}
              className="w-full px-4 py-2.5 text-left text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 transition-all duration-200 flex items-center gap-2 rounded-lg mx-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Sign Out
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export const Header: React.FC<HeaderProps> = ({
  onGoHome,
  theme,
  toggleTheme,
  isLandingPage,
  user,
  authLoading,
  onSignIn,
  onSignOut,
  onShowHistory,
  onShowShortcuts,
}) => {
  const headerClasses = isLandingPage
    ? "absolute top-0 left-0 right-0 z-10"
    : "bg-white/60 dark:bg-dark-surface/60 backdrop-blur-md border-b border-slate-200/50 dark:border-slate-700/50 sticky top-0 z-10 shadow-sm";

  const containerClasses = `container mx-auto px-4 py-3 flex items-center justify-between`;
  
  return (
    <header className={headerClasses}>
      <div className={containerClasses}>
        {!isLandingPage ? (
          <button onClick={onGoHome} className="flex items-center gap-3 group transition-all duration-300 hover:scale-105">
              <div className="relative">
                <SparklesIcon className="w-8 h-8 text-primary-600 dark:text-primary-400 group-hover:rotate-12 transition-transform duration-500"/>
                <div className="absolute inset-0 bg-primary-500/20 blur-xl group-hover:blur-2xl transition-all duration-500 opacity-0 group-hover:opacity-100" />
              </div>
              <div className="text-left">
                  <h1 className="text-xl font-bold gradient-text font-display">AI Room Designer</h1>
                  <p className="text-xs text-slate-500 dark:text-slate-400 hidden sm:block">Instantly visualize your dream space.</p>
              </div>
          </button>
        ) : (
          <div className="flex items-center gap-3 group">
            <div className="relative">
              <SparklesIcon className="w-8 h-8 text-primary-600 dark:text-primary-400 group-hover:rotate-12 transition-transform duration-500" />
              <div className="absolute inset-0 bg-primary-500/20 blur-xl transition-all duration-500" />
            </div>
            <span className="text-lg font-bold gradient-text font-display">AI Room Designer</span>
          </div>
        )}
        <div className="flex items-center gap-4">
          <ThemeSwitcher theme={theme} toggleTheme={toggleTheme} />
          <AuthControls
            user={user}
            authLoading={authLoading}
            onSignIn={onSignIn}
            onSignOut={onSignOut}
            onShowHistory={onShowHistory}
            onShowShortcuts={onShowShortcuts}
          />
        </div>
      </div>
    </header>
  );
};