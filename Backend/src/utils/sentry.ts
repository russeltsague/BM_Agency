import * as Sentry from '@sentry/node';

// Initialize Sentry
export const initSentry = () => {
  if (process.env.NODE_ENV === 'production' && process.env.SENTRY_DSN) {
    Sentry.init({
      dsn: process.env.SENTRY_DSN,
      integrations: [
        // Basic integrations for now
        Sentry.httpIntegration(),
      ],
      // Performance Monitoring
      tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
      // Release Health
      environment: process.env.NODE_ENV || 'development',
    });

    console.log('Sentry initialized for error tracking');
  }
};

// Sentry error handler middleware
export const sentryErrorHandler = (error: any, req: any, res: any, next: any) => {
  // Only capture errors in production
  if (process.env.NODE_ENV === 'production' && process.env.SENTRY_DSN) {
    Sentry.withScope((scope) => {
      scope.setTag('endpoint', req.path);
      scope.setTag('method', req.method);
      scope.setTag('userAgent', req.get('User-Agent'));

      if (req.user) {
        scope.setUser({
          id: req.user.id,
          email: req.user.email,
        });
      }

      Sentry.captureException(error);
    });
  }

  // Continue to next error handler
  next(error);
};

// Manual error reporting utility
export const reportError = (error: Error, context?: any) => {
  if (process.env.NODE_ENV === 'production' && process.env.SENTRY_DSN) {
    Sentry.withScope((scope) => {
      if (context) {
        scope.setContext('additional_info', context);
      }
      Sentry.captureException(error);
    });
  } else {
    console.error('Error:', error.message, context);
  }
};

// Performance monitoring utility
export const startTransaction = (name: string, description?: string) => {
  if (process.env.NODE_ENV === 'production' && process.env.SENTRY_DSN) {
    // Simplified for now - return null to avoid API issues
    return null;
  }
  return null;
};

// User feedback for error reporting
export const captureUserFeedback = (eventId: string, feedback: { message: string; email?: string; name?: string }) => {
  if (process.env.NODE_ENV === 'production' && process.env.SENTRY_DSN) {
    // Simplified feedback capture for testing
    console.log('User feedback captured:', { eventId, ...feedback });
  }
};

// Export Sentry for direct access if needed
export { Sentry };
