import {StrictMode} from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import {QueryClientProvider} from "@tanstack/react-query";
import {queryClient} from "./data/queryClient.ts";
import './i18n.ts'
import {createBrowserRouter, RouterProvider} from "react-router-dom";
import { SleepSessionsGraph2D } from 'modules/graph/SleepSessionsGraph2D';
import SleepApp from "SleepApp.tsx";

const router = createBrowserRouter([
  {
    element: <SleepApp />,
    children: [
      {
        path: '/sleep',
        element: <SleepSessionsGraph2D />
      }
    ]
  }
])

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  </StrictMode>
)
