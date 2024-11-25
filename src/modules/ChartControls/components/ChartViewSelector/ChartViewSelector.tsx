import { Button, Dropdown, MenuProps } from 'antd'
import { useCallback, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useQueryParams } from 'hooks/useQueryParams'
import { PageRoutes } from 'routes'
import { useChartConfigContext } from 'context/ChartConfigContext'
import { MenuInfo } from 'rc-menu/lib/interface'
import { ChartView } from 'modules/ChartControls/components/ChartViewSelector/types'

export const ChartViewSelector = () => {
  const { chartView, setChartView, setStackedMetrics } = useChartConfigContext()
  const { updateQueryParam, removeQueryParam } = useQueryParams()
  const { t } = useTranslation('translation', { keyPrefix: 'sleep.graph-controls.view' })

  const handleSelect = useCallback(({ key }: MenuInfo) => {
    const newChartView = key as ChartView
    setChartView(newChartView)

    updateQueryParam({
      route: PageRoutes.SLEEP,
      params: {
        view: newChartView
      }
    })

    if (newChartView == ChartView.SINGLE_METRIC) {
      setStackedMetrics([])

      removeQueryParam({
        route: PageRoutes.SLEEP,
        key: 'metrics'
      })
    }
  }, [removeQueryParam, setChartView, setStackedMetrics, updateQueryParam])

  const items = useMemo<MenuProps['items']>(() => ([
    {
      key: ChartView.SINGLE_METRIC,
      label: t(`${ChartView.SINGLE_METRIC}.label`)
    },
    {
      key: ChartView.MULTIPLE_METRICS,
      label: t(`${ChartView.MULTIPLE_METRICS}.label`)
    },
    {
      key: ChartView.STACKED_METRICS,
      label: t(`${ChartView.STACKED_METRICS}.label`)
    }
  ]), [t])

  return (
    <Dropdown
      menu={{
        items,
        selectable: true,
        onClick: handleSelect,
        defaultSelectedKeys: [chartView]
      }}
      placement='bottom'
    >
      <Button>
        {t(`${chartView}.label`)}
      </Button>
    </Dropdown>
  )
}