// Analytics and monitoring utilities

interface AnalyticsEvent {
  name: string;
  properties?: Record<string, any>;
  timestamp?: number;
}

interface PerformanceMetric {
  name: string;
  value: number;
  timestamp: number;
  metadata?: Record<string, any>;
}

class Analytics {
  private isEnabled: boolean;
  private userId: string | null = null;
  private sessionId: string;

  constructor() {
    this.isEnabled = process.env.NODE_ENV === 'production';
    this.sessionId = this.generateSessionId();
    this.initializeSession();
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private initializeSession() {
    if (!this.isEnabled) return;

    // Track session start
    this.track('session_start', {
      userAgent: navigator.userAgent,
      screen: {
        width: screen.width,
        height: screen.height,
      },
      viewport: {
        width: window.innerWidth,
        height: window.innerHeight,
      },
      referrer: document.referrer,
    });

    // Track page visibility changes
    document.addEventListener('visibilitychange', () => {
      this.track('page_visibility_change', {
        visibility: document.visibilityState,
      });
    });

    // Track unload
    window.addEventListener('beforeunload', () => {
      this.track('session_end', {
        duration: Date.now() - parseInt(this.sessionId.split('_')[1]),
      });
    });
  }

  setUserId(userId: string) {
    this.userId = userId;
  }

  track(eventName: string, properties: Record<string, any> = {}) {
    if (!this.isEnabled) {
      console.log(`[Analytics] ${eventName}:`, properties);
      return;
    }

    const event: AnalyticsEvent = {
      name: eventName,
      properties: {
        ...properties,
        sessionId: this.sessionId,
        userId: this.userId,
        timestamp: Date.now(),
        url: window.location.href,
        userAgent: navigator.userAgent,
      },
      timestamp: Date.now(),
    };

    // Send to your analytics service
    this.sendEvent(event);
  }

  private sendEvent(event: AnalyticsEvent) {
    try {
      // Example: Send to Google Analytics, Mixpanel, etc.
      // gtag('event', event.name, event.properties);
      
      // For now, just log in development
      if (process.env.NODE_ENV === 'development') {
        console.log('[Analytics Event]:', event);
      }

      // Store in localStorage as fallback
      const events = JSON.parse(localStorage.getItem('analytics_events') || '[]');
      events.push(event);
      // Keep only last 100 events
      if (events.length > 100) {
        events.splice(0, events.length - 100);
      }
      localStorage.setItem('analytics_events', JSON.stringify(events));
    } catch (error) {
      console.error('Failed to send analytics event:', error);
    }
  }

  // Room design specific events
  trackRoomUpload(fileSize: number, fileType: string, dimensions: { width: number; height: number }) {
    this.track('room_image_uploaded', {
      fileSize,
      fileType,
      imageDimensions: dimensions,
    });
  }

  trackDesignGeneration(prompt: string, success: boolean, duration?: number, error?: string) {
    this.track('design_generation', {
      promptLength: prompt.length,
      success,
      duration,
      error,
      hasImage: true,
    });
  }

  trackDesignDownload(imageType: 'original' | 'generated') {
    this.track('design_download', {
      imageType,
    });
  }

  trackDesignShare(method: 'native' | 'clipboard' | 'download') {
    this.track('design_share', {
      method,
    });
  }

  trackThemeChange(theme: 'light' | 'dark') {
    this.track('theme_change', {
      theme,
    });
  }

  trackPromptSuggestionUsed(suggestion: string) {
    this.track('prompt_suggestion_used', {
      suggestionLength: suggestion.length,
    });
  }
}

class PerformanceMonitor {
  private metrics: PerformanceMetric[] = [];
  private isEnabled: boolean;

  constructor() {
    this.isEnabled = process.env.NODE_ENV === 'production';
    this.setupPerformanceObserver();
  }

  private setupPerformanceObserver() {
    if (!this.isEnabled || !('PerformanceObserver' in window)) return;

    try {
      // Observe Core Web Vitals
      const observer = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
          const value = 'value' in entry ? (entry as any).value : entry.duration;
          this.recordMetric(entry.name, Number(value) || 0, {
            entryType: entry.entryType,
          });
        });
      });

      observer.observe({ entryTypes: ['measure', 'mark', 'largest-contentful-paint', 'first-input', 'layout-shift'] });
    } catch (error) {
      console.warn('Performance observer not supported:', error);
    }
  }

  recordMetric(name: string, value: number, metadata?: Record<string, any>) {
    const metric: PerformanceMetric = {
      name,
      value,
      timestamp: Date.now(),
      metadata,
    };

    this.metrics.push(metric);

    // Keep only recent metrics
    if (this.metrics.length > 1000) {
      this.metrics.splice(0, this.metrics.length - 1000);
    }

    if (this.isEnabled) {
      // Send to monitoring service
      this.sendMetric(metric);
    } else {
      console.log(`[Performance] ${name}: ${value}ms`, metadata);
    }
  }

  private sendMetric(metric: PerformanceMetric) {
    try {
      // Send to your monitoring service (e.g., DataDog, New Relic, etc.)
      if (process.env.NODE_ENV === 'development') {
        console.log('[Performance Metric]:', metric);
      }
    } catch (error) {
      console.error('Failed to send performance metric:', error);
    }
  }

  // Specific measurements
  measureImageUpload() {
    performance.mark('image-upload-start');
    return () => {
      performance.mark('image-upload-end');
      performance.measure('image-upload', 'image-upload-start', 'image-upload-end');
      this.recordMetric('image_upload_duration', performance.getEntriesByName('image-upload')[0].duration);
    };
  }

  measureDesignGeneration() {
    performance.mark('design-generation-start');
    return () => {
      performance.mark('design-generation-end');
      performance.measure('design-generation', 'design-generation-start', 'design-generation-end');
      this.recordMetric('design_generation_duration', performance.getEntriesByName('design-generation')[0].duration);
    };
  }

  measureImageProcessing() {
    performance.mark('image-processing-start');
    return () => {
      performance.mark('image-processing-end');
      performance.measure('image-processing', 'image-processing-start', 'image-processing-end');
      this.recordMetric('image_processing_duration', performance.getEntriesByName('image-processing')[0].duration);
    };
  }

  getMetrics(): PerformanceMetric[] {
    return [...this.metrics];
  }

  clearMetrics() {
    this.metrics = [];
  }
}

// Error tracking
class ErrorTracker {
  private isEnabled: boolean;

  constructor() {
    this.isEnabled = process.env.NODE_ENV === 'production';
    this.setupGlobalErrorHandlers();
  }

  private setupGlobalErrorHandlers() {
    // Handle JavaScript errors
    window.addEventListener('error', (event) => {
      this.trackError(event.error, {
        type: 'javascript_error',
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
      });
    });

    // Handle unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
      this.trackError(event.reason, {
        type: 'unhandled_promise_rejection',
      });
    });
  }

  trackError(error: Error, metadata?: Record<string, any>) {
    const errorData = {
      message: error.message,
      stack: error.stack,
      timestamp: Date.now(),
      url: window.location.href,
      userAgent: navigator.userAgent,
      ...metadata,
    };

    if (this.isEnabled) {
      // Send to error tracking service (e.g., Sentry, Bugsnag, etc.)
      this.sendError(errorData);
    } else {
      console.error('[Error Tracked]:', errorData);
    }
  }

  private sendError(errorData: any) {
    try {
      // Send to your error tracking service
      if (process.env.NODE_ENV === 'development') {
        console.log('[Error Data]:', errorData);
      }

      // Store in localStorage as fallback
      const errors = JSON.parse(localStorage.getItem('error_logs') || '[]');
      errors.push(errorData);
      // Keep only last 50 errors
      if (errors.length > 50) {
        errors.splice(0, errors.length - 50);
      }
      localStorage.setItem('error_logs', JSON.stringify(errors));
    } catch (error) {
      console.error('Failed to send error:', error);
    }
  }
}

// Singleton instances
export const analytics = new Analytics();
export const performanceMonitor = new PerformanceMonitor();
export const errorTracker = new ErrorTracker();

// Utility functions
export const trackPageView = (pageName: string) => {
  analytics.track('page_view', { pageName });
};

export const trackFeatureUsage = (feature: string, metadata?: Record<string, any>) => {
  analytics.track('feature_used', { feature, ...metadata });
};