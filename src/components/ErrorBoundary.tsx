import { Component, type ReactNode } from 'react';

type Props = {
  children: ReactNode;
  fallback: (error: Error) => ReactNode;
};

type State = { error: Error | null };

class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  render() {
    if (this.state.error) {
      return this.props.fallback(this.state.error);
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
