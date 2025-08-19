'use client';

import { Component, ReactNode, ErrorInfo, ComponentType } from 'react';
import { useRouter } from 'next/navigation';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log error to console or external service
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    
    // Call optional error handler
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  render() {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default fallback UI
      return (
        <div className="min-h-screen bg-base-100 flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-base-200 rounded-2xl p-6 text-center">
            <div className="text-error text-4xl mb-4">⚠️</div>
            <h2 className="text-brand-heading text-base-content mb-2">
              Oops! Something went wrong
            </h2>
            <p className="text-brand-body text-base-content/70 mb-4">
              We&apos;re sorry, but something unexpected happened. Please try refreshing the page.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="btn bg-brand-orange hover:bg-brand-orange-light text-white border-0"
            >
              Refresh Page
            </button>
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="mt-4 text-left">
                <summary className="cursor-pointer text-sm text-base-content/60">
                  Error Details (Development)
                </summary>
                <pre className="mt-2 text-xs bg-base-300 p-2 rounded overflow-auto">
                  {this.state.error.toString()}
                </pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Hook-based error boundary for functional components
export function withErrorBoundary<T extends object>(
  Component: ComponentType<T>,
  fallback?: ReactNode,
  onError?: (error: Error, errorInfo: ErrorInfo) => void
) {
  return function WrappedComponent(props: T) {
    return (
      <ErrorBoundary fallback={fallback} onError={onError}>
        <Component {...props} />
      </ErrorBoundary>
    );
  };
}

// Specific error boundary for auth components
export function AuthErrorBoundary({ children }: { children: ReactNode }) {
  const router = useRouter();

  return (
    <ErrorBoundary
      fallback={
        <div className="min-h-screen bg-base-100 flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-base-200 rounded-lg p-6 text-center">
            <div className="text-error text-4xl mb-4">🔐</div>
            <h2 className="text-brand-heading text-base-content mb-2">
              Authentication Error
            </h2>
            <p className="text-brand-body text-base-content/70 mb-4">
              There was a problem with the authentication system. Please try again.
            </p>
            <button
              onClick={() => router.replace('/')}
              className="btn bg-brand-orange hover:bg-brand-orange-light text-white border-0"
            >
              Go to Login
            </button>
          </div>
        </div>
      }
      onError={(error, errorInfo) => {
        console.error('Auth Error:', error, errorInfo);
        // Here you could send to error tracking service
      }}
    >
      {children}
    </ErrorBoundary>
  );
}
