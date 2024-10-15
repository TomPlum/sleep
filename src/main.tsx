import {StrictMode} from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import {QueryClientProvider} from "@tanstack/react-query";
import {queryClient} from "./data/queryClient.ts";
import './i18n.ts'
import {createBrowserRouter, RouterProvider} from "react-router-dom";
import SleepApp from "SleepApp.tsx";
import {SleepPage} from "pages/SleepPage.tsx";
import {NotFoundPage} from "pages/NotFoundPage.tsx";

const router = createBrowserRouter([
  {
    element: <SleepApp />,
    children: [
      {
        path: '/',
        element: <SleepPage />
      },
      {
        path: '*',
        element: <NotFoundPage />
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
