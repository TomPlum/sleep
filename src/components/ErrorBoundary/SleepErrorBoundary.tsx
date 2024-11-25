import { ErrorBoundary } from 'react-error-boundary'
import { PropsWithChildren } from 'react'
import { ErrorBoundaryFallback } from 'components/ErrorBoundary/ErrorBoundaryFallback'

export const SleepErrorBoundary = ({ children }: PropsWithChildren) => {
  return (
    <ErrorBoundary FallbackComponent={ErrorBoundaryFallback}>
      {children}
    </ErrorBoundary>
  )
}