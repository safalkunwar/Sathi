import React, { Component, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: any) {
    console.error('React render error:', error, info);
  }

  render() {
    if (this.state.error) {
      return this.props.fallback || (
        <div className="min-h-screen bg-[#0F1113] text-white flex items-center justify-center p-6">
          <div className="max-w-lg w-full bg-[#17191C] border border-red-500/30 rounded-2xl p-6">
            <h1 className="text-xl font-bold text-red-400 mb-2">Something went wrong</h1>
            <pre className="text-xs text-[#8E9299] whitespace-pre-wrap bg-black/20 p-3 rounded-xl mt-3">
              {this.state.error.message}
            </pre>
            <button
              onClick={() => {
                this.setState({ error: null });
                window.location.reload();
              }}
              className="mt-4 px-4 py-2 bg-[#C8A25E] text-[#0F1113] rounded-xl font-bold text-sm"
            >
              Retry
            </button>
          </div>
        </div>
      );
    }
    return this.props.children as any;
  }
}
