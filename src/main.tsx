import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { ErrorBoundary } from './components/ErrorBoundary';
import { AuthProvider } from './context/AuthContext';
import { logger } from './utils/logger';
import './index.css';

// Performance monitoring
if (typeof window !== 'undefined') {
  // Basic performance monitoring
  window.addEventListener('load', () => {
    if ('performance' in window) {
      const loadTime = performance.now();
      logger.info(`App loaded in ${loadTime.toFixed(2)}ms`);
    }
  });
}

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <AuthProvider>
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    </AuthProvider>
  </React.StrictMode>
);
