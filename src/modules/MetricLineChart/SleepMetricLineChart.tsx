import {
  CartesianGrid,
  Label,
  Line,
  LineChart,
  ReferenceArea,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts'
import { useLinearRegression } from 'data/useLinearRegression'
import { CustomYAxisTick } from 'modules/MetricLineChart/components/CustomYAxisTick'
import { SleepSessionTooltip } from 'modules/MetricLineChart/components/SleepSessionTooltip'
import { CustomXAxisTick } from 'modules/MetricLineChart/components/CustomXAxisTick'
import { useGraphStyles } from 'modules/MetricLineChart/hooks/useGraphStyles'
import { useSleepContext } from 'context/SleepContext'
import styles from './SleepMetricLineChart.module.scss'
import { useTypicalSession } from 'modules/MetricLineChart/hooks/useTypicalSession'
import { useTranslation } from 'react-i18next'
import { useAxes2D } from 'modules/MetricLineChart/hooks/useAxes2D'
import { RegressionDeltaLabel } from 'modules/MetricLineChart/components/RegressionDeltaLabel'
import { ANIMATION_DURATION, SleepMetricLineChartProps } from './types'
import { LineActiveDot } from 'modules/MetricLineChart/components/LineActiveDot'
import { useGraphHeight } from 'modules/MetricLineChart/hooks/useGraphHeight'
import { useCallback, useMemo } from 'react'
import { PageRoutes } from 'routes'
import { useQueryParams } from 'hooks/useQueryParams'
import { useChartConfigContext } from 'context/ChartConfigContext'
import { ChartView } from 'modules/ChartControls/components/ChartViewSelector/types'
import { SleepMetric } from 'modules/ChartControls'

export const SleepMetricLineChart = ({
   metric,
   className
}: SleepMetricLineChartProps) => {
  const { t } = useTranslation('translation', { keyPrefix: 'sleep.graph2d' })

  const { height } = useGraphHeight()
  const { updateQueryParam } = useQueryParams()
  const { chartView, stackedMetrics } = useChartConfigContext()

  const lineMetrics = useMemo(() => {
    if (chartView == ChartView.SINGLE_METRIC || chartView === ChartView.STACKED_METRICS) {
      return [metric]
    }

    return stackedMetrics
  }, [chartView, metric, stackedMetrics])

  const { typicalSleepSessions } = useTypicalSession({ metrics: lineMetrics })
  const { xTicks, yTicks, xAxisInterval, yDomain } = useAxes2D({ metrics: lineMetrics })
  const { getMetricColour, strokeWidth, activeDotRadius } = useGraphStyles({ metric })

  const { improvementDate, graphData2d: { data, earliestSession, latestSession } } = useSleepContext()
  
  const {
    regressionLineData,
    regressionDataKey,
    regressionDelta,
    regressionLineDeltaVertical,
    regressionLineDeltaHorizontal
  } = useLinearRegression({ metric })

  const handleSelectSession = useCallback((index: number) => {
    updateQueryParam({
      route: PageRoutes.SLEEP,
      params: {
        selected: index.toString()
      }
    })
  }, [updateQueryParam])

  const isTopGraph = stackedMetrics.indexOf(metric) === 0

  return (
    <ResponsiveContainer width='100%' height={height} className={className}>
      <LineChart
        id='sleeps-sessions-graph-2d'
        margin={{ left: -55, bottom: -22 }}
        syncId='sleep_sessions_line_chart_2d'
      >
        {lineMetrics.map((lineMetric: SleepMetric) => (
          <Line
            data={data}
            type='monotone'
            activeDot={false}
            dataKey={lineMetric}
            animationDuration={500}
            isAnimationActive={true}
            strokeWidth={strokeWidth}
            id={`${lineMetric}_line`}
            key={`${lineMetric}_line`}
            animationEasing='ease-in-out'
            className={styles.metricLine}
            stroke={getMetricColour(lineMetric)}
            dot={{ fill: undefined, r: activeDotRadius }}
            label={data => (
              <LineActiveDot
                data={data}
                onClick={handleSelectSession}
                radius={activeDotRadius - 3}
              />
            )}
          />
        ))}

        {chartView == ChartView.SINGLE_METRIC && (
          <>
            <Line
              dot={false}
              type='monotone'
              isAnimationActive={true}
              strokeWidth={strokeWidth}
              stroke='rgb(255, 255, 255)'
              dataKey={regressionDataKey}
              animationEasing='ease-in-out'
              id={`${metric}_regression_line`}
              animationDuration={ANIMATION_DURATION}
              data={regressionLineData.map(({ y, xDate }) => ({
                xDate,
                [metric]: y,
              }))}
            />

            <Line
              dot={false}
              dataKey='y'
              type='monotone'
              strokeWidth={1}
              strokeDasharray='10 15'
              stroke='rgb(255, 255, 255)'
              data={regressionLineDeltaHorizontal}
              animationDuration={ANIMATION_DURATION}
              id={`${metric}_regression_line_delta_h`}
              label={props => <RegressionDeltaLabel {...props} regressionDelta={regressionDelta} />}
            />

            <Line
              dot={false}
              dataKey='y'
              type='monotone'
              strokeWidth={2}
              strokeDasharray='10 15'
              stroke='rgb(255, 255, 255)'
              data={regressionLineDeltaVertical}
              animationDuration={ANIMATION_DURATION}
              id={`${metric}_regression_line_delta_v`}
            />
          </>
        )}

        {typicalSleepSessions.map((area) => (
          <ReferenceArea
            {...area}
            ifOverflow='extendDomain'
            className={styles.typicalSleepSessionArea}
            id={`${area.metric}_typical_sleep_session_area`}
            key={`${area.metric}_typical_sleep_session_area`}
          >
            <Label
              offset={10}
              position='insideTopLeft'
              value={t('typical-sleep-session')}
              className={styles.healthyRangeLabel}
              id={`${area.metric}_typical_sleep_session_area_label`}
            />
          </ReferenceArea>
        ))}

        {improvementDate && (
          <ReferenceLine
            strokeWidth={2}
            strokeDasharray='5 10'
            stroke='rgb(255, 255, 255)'
            x={improvementDate?.getTime()}
            id='started_making_improvements_date_line'
          >
            {(chartView === ChartView.SINGLE_METRIC || isTopGraph) && (
              <Label
                dx={-8}
                dy={-100}
                position='insideBottomRight'
                value={t('improvement-label')}
                className={styles.improvementLabel}
              />
            )}
          </ReferenceLine>
        )}

        <XAxis
          type='number'
          scale='time'
          dataKey='xDate'
          strokeWidth={3}
          ticks={xTicks}
          axisLine={false}
          tick={props => (
            <CustomXAxisTick
              {...props}
              earliestSession={earliestSession}
              latestSession={latestSession}
            />
          )}
          interval={xAxisInterval}
          allowDataOverflow={true}
          stroke='rgb(255, 255, 255)'
          hide={chartView === ChartView.STACKED_METRICS && isTopGraph}
          domain={[earliestSession.getTime(), latestSession.getTime()]}
        />

        <YAxis
          ticks={yTicks}
          strokeWidth={3}
          axisLine={false}
          domain={yDomain}
          dataKey={metric}
          orientation='left'
          tick={CustomYAxisTick}
          stroke='rgb(255, 255, 255)'
          padding={{ bottom: 40, top: chartView !== ChartView.STACKED_METRICS ? 80 : chartView === ChartView.STACKED_METRICS && isTopGraph ? 80 : 0 }} // TODO: Move to graph styles or axes hook
          tickFormatter={value => `${value}%`}
        />

        <Tooltip
          content={(chartView === ChartView.SINGLE_METRIC || !isTopGraph) ? SleepSessionTooltip : <div />}
        />

        <CartesianGrid
          strokeDasharray="3 10"
          stroke='rgba(255, 255, 255, 0.2)'
        />
      </LineChart>
    </ResponsiveContainer>
  )
}