import {StrictMode} from 'react'
import { createRoot } from 'react-dom/client'
import SleepApp from './SleepApp.tsx'
import './index.css'
import {QueryClientProvider} from "@tanstack/react-query";
import {queryClient} from "./data/queryClient.ts";
import './i18n.ts'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <SleepApp />
    </QueryClientProvider>
  </StrictMode>,
)
