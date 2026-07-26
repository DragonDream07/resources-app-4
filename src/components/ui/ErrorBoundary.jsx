import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    // Log to console; integrate with external monitoring if available.
    console.error('[ErrorBoundary] Caught render error:', error, info);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    if (typeof this.props.onReset === 'function') {
      this.props.onReset();
    }
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return typeof this.props.fallback === 'function'
          ? this.props.fallback({ error: this.state.error, reset: this.handleReset })
          : this.props.fallback;
      }

      return (
        <div
          role="alert"
          className="flex flex-col items-center justify-center gap-4 py-16 px-6 text-center"
        >
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-red-100">
            <span className="text-2xl font-bold text-red-600" aria-hidden="true">
              !
            </span>
          </div>

          <div className="max-w-sm">
            <h2 className="text-lg font-semibold text-gray-800">
              Something went wrong
            </h2>
            {this.state.error?.message && (
              <p className="mt-1 text-sm text-gray-500 font-mono break-all">
                {this.state.error.message}
              </p>
            )}
          </div>

          <button
            type="button"
            onClick={this.handleReset}
            className="inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
          >
            Try again
          </button>
        </div>
      );
    }

    return this.props.children ?? null;
  }
}

export default ErrorBoundary;
