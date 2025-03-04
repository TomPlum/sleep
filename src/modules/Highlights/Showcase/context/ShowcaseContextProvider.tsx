import { ShowcaseContext } from 'modules/Highlights/Showcase/context/ShowcaseContext'
import { PropsWithChildren, useEffect, useMemo } from 'react'
import { ShowcaseContextBag } from 'modules/Highlights/Showcase/context/types'
import { useQueryParams } from 'hooks/useQueryParams'
import { PageRoutes } from 'routes.ts'

export const ShowcaseContextProvider = ({ children }: PropsWithChildren) => {
  const { queryParams, updateQueryParam } = useQueryParams()
  const active = queryParams.active ?? 0

  useEffect(() => {
    if (!queryParams.active) {
      updateQueryParam({
        route: PageRoutes.HIGHLIGHTS,
        params: {
          active: '0'
        }
      })
    }
  }, [queryParams.active, updateQueryParam])

  const value = useMemo<ShowcaseContextBag>(() => ({
    active,
    onEnd: () => {
      updateQueryParam({
        route: PageRoutes.HIGHLIGHTS,
        params: {
          active: (active + 1).toString()
        }
      })
    }
  }), [active, updateQueryParam])

  return (
    <ShowcaseContext.Provider value={value}>
      {children}
    </ShowcaseContext.Provider>
  )
}