import { QueryClientProvider } from '@tanstack/react-query'
import { PropsWithChildren } from 'react'
import { queryClient } from 'data/queryClient'

export const wrapper = ({ children }: PropsWithChildren) => (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
)