import { matchPath, useLocation } from 'react-router-dom'
import { PageRoutes } from 'routes.ts'

export const useCurrentRoute = () => {
  const { pathname } = useLocation()

  return {
    currentRoute: Object.values(PageRoutes).find(route => matchPath(route, pathname))
  }
}