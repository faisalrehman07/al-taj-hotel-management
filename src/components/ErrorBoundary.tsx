import React from 'react';

interface Props {
  children: React.ReactNode;
  fallbackMessage?: string;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<Props, State> {
  public override state: State;

  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public override componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('AL-TAJ HOTEL Application caught an error:', error, errorInfo);
  }

  public handleReload = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  public override render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#0b0b0c] text-[#f5f0e6] flex items-center justify-center p-6">
          <div className="max-w-md w-full bg-[#141416] border border-[#c5a869]/30 rounded-2xl p-8 text-center shadow-2xl">
            <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-[#c5a869]/10 border border-[#c5a869]/40 flex items-center justify-center text-[#c5a869]">
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h2 className="font-royal text-2xl text-[#f5f0e6] mb-3">AL-TAJ HOTEL</h2>
            <p className="text-[#c5a869] text-xs uppercase tracking-widest mb-4">Service Notice</p>
            <p className="text-[#a39e93] text-sm leading-relaxed mb-6">
              {this.props.fallbackMessage || 'We encountered a momentary issue while loading this section. Our culinary team and system are ready to serve you.'}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={this.handleReload}
                className="px-6 py-2.5 bg-[#c5a869] hover:bg-[#d4af37] text-[#0b0b0c] font-medium text-sm rounded-lg transition-colors cursor-pointer"
              >
                Refresh View
              </button>
              <button
                onClick={() => { window.location.href = '/'; }}
                className="px-6 py-2.5 bg-[#1f1f23] hover:bg-[#2a2a30] text-[#f5f0e6] font-medium text-sm rounded-lg border border-[#c5a869]/20 transition-colors cursor-pointer"
              >
                Return to Home
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
