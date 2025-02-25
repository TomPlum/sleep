import { createRoot } from 'react-dom/client'
import './index.css'
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from './data/queryClient'
import './i18n'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import SleepApp from 'SleepApp'
import { SleepPage } from 'pages/SleepPage'
import { NotFoundPage } from 'pages/NotFoundPage'
import { ConfigProvider } from 'antd'
import { PageRoutes } from 'routes'
import { ImprovementsPage } from 'pages/ImprovementsPage'
import { HighlightsPage } from 'pages/HighlightsPage'

const router = createBrowserRouter([
  {
    element: <SleepApp />,
    children: [
      {
        path: PageRoutes.SLEEP,
        element: <SleepPage />
      },
      {
        path: PageRoutes.IMPROVEMENTS,
        element: <ImprovementsPage />
      },
      {
        path: PageRoutes.HIGHLIGHTS,
        element: <HighlightsPage />
      },
      {
        path: '*',
        element: <NotFoundPage />
      }
    ]
  }
])

// TODO: Can we add strict mode back in with the DataWorker?
createRoot(document.getElementById('root')!).render(
  <QueryClientProvider client={queryClient}>
    <ConfigProvider
      theme={{
        token: {
          fontFamily: 'Nunito'
        }
      }}
    >
      <RouterProvider router={router} />
    </ConfigProvider>
  </QueryClientProvider>
)
