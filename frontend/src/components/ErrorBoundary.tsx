import { Component, type ReactNode } from 'react'
import { isProd } from '../utils/env'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  error: Error | null
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null }

  static getDerivedStateFromError(error: Error): State {
    return { error }
  }

  componentDidCatch(error: Error, info: { componentStack: string }) {
    if (!isProd()) {
      console.error('[ErrorBoundary]', error, info.componentStack)
    }
    // TODO: forward to frontend observability SDK (e.g. Sentry.captureException)
    // once it is installed — call only here, nowhere else.
  }

  render() {
    if (this.state.error) {
      if (!isProd()) {
        return (
          <div
            style={{
              padding: '24px',
              fontFamily: 'monospace',
              background: '#1a1a1a',
              color: '#f87171',
              borderRadius: '8px',
              margin: '16px',
            }}
          >
            <h2 style={{ margin: '0 0 12px' }}>Dev Error</h2>
            <pre style={{ margin: '0 0 8px', whiteSpace: 'pre-wrap' }}>
              {this.state.error.message}
            </pre>
            <pre style={{ fontSize: '12px', opacity: 0.75, whiteSpace: 'pre-wrap' }}>
              {this.state.error.stack}
            </pre>
          </div>
        )
      }

      return (
        this.props.fallback ?? (
          <div style={{ padding: '48px 24px', textAlign: 'center' }}>
            <h2>Something went wrong.</h2>
            <p>Please refresh the page or try again later.</p>
          </div>
        )
      )
    }

    return this.props.children
  }
}
