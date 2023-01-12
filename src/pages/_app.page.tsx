import { QueryClientProvider } from '@tanstack/react-query'
import type { AppProps } from 'next/app'
import { queryClient } from '../lib/react-query'
import { globalStyles } from '../styles/global'

globalStyles()

export default function App({ Component, pageProps }: AppProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <Component {...pageProps} />
    </QueryClientProvider>
  )
}
