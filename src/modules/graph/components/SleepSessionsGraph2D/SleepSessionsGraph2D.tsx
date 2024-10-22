import {
  CartesianGrid,
  Label,
  Line,
  LineChart,
  ReferenceArea, ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts'
import { useLinearRegression } from 'data/useLinearRegression'
import { CustomYAxisTick } from 'modules/graph/components/CustomYAxisTick'
import { SleepSessionTooltip } from 'modules/graph/components/SleepSessionTooltip'
import { CustomXAxisTick } from 'modules/graph/components/CustomXAxisTick'
import { useGraphStyles } from 'modules/graph/hooks/useGraphStyles'
import { useSleepContext } from 'context'
import styles from './SleepSessionGraph2D.module.scss'
import { useTypicalSession } from 'modules/graph/hooks/useTypicalSession/useTypicalSession'
import { useTranslation } from 'react-i18next'
import { useAxes2D } from 'modules/graph/hooks/useAxes2D'
import { RegressionDeltaLabel } from 'modules/graph/components/RegressionDeltaLabel'
import { SleepSessionsGraph2DProps } from './types'

const animationDuration = 500

export const SleepSessionsGraph2D = ({ metric, className }: SleepSessionsGraph2DProps) => {
  const { xTicks, yTicks, xAxisInterval, yDomain } = useAxes2D({ metric })
  const { t } = useTranslation('translation', { keyPrefix: 'sleep.graph2d' })
  const { typicalSleepSession , typicalSleepSessionFill } = useTypicalSession({ metric })
  const { currentMetricColour, strokeWidth, activeDotRadius } = useGraphStyles({ metric })
  const { graphData2d: { data, earliestSession, latestSession }, improvementDate, stackedView, stackedMetrics } = useSleepContext()

  const {
    regressionLineData,
    regressionDataKey,
    regressionDelta,
    regressionLineDeltaVertical,
    regressionLineDeltaHorizontal
  } = useLinearRegression({ metric })

  const isTopGraph = stackedMetrics.indexOf(metric) === 0

  return (
    <ResponsiveContainer width='100%' height={stackedView ? '50%' : '100%'} className={className}>
      <LineChart
        id='sleeps-sessions-graph-2d'
        margin={{ left: -55, bottom: -22 }}
        syncId='sleep_sessions_line_chart_2d'
      >
        <Line
          data={data}
          type='monotone'
          dataKey={metric}
          id={`${metric}_line`}
          animationDuration={500}
          isAnimationActive={true}
          strokeWidth={strokeWidth}
          stroke={currentMetricColour}
          animationEasing='ease-in-out'
          className={styles.metricLine}
          dot={{ fill: undefined, r: activeDotRadius }}
        />

        <Line
          dot={false}
          type='monotone'
          isAnimationActive={true}
          strokeWidth={strokeWidth}
          stroke='rgb(255, 255, 255)'
          dataKey={regressionDataKey}
          animationEasing='ease-in-out'
          id={`${metric}_regression_line`}
          animationDuration={animationDuration}
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
          animationDuration={animationDuration}
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
          animationDuration={animationDuration}
          id={`${metric}_regression_line_delta_v`}
        />

        {typicalSleepSession && (
          <ReferenceArea
            {...typicalSleepSession}
            ifOverflow='extendDomain'
            fill={typicalSleepSessionFill}
            id={`${metric}_typical_sleep_session_area`}
          >
            <Label
              offset={10}
              position='insideTopLeft'
              value={t('typical-sleep-session')}
              className={styles.healthyRangeLabel}
            />
          </ReferenceArea>
        )}

        {improvementDate && (
          <ReferenceLine
            strokeWidth={2}
            strokeDasharray='5 10'
            stroke='rgb(255, 255, 255)'
            x={improvementDate?.getTime()}
            id='started_making_improvements_date_line'
          >
            {isTopGraph && (
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
          hide={stackedView && isTopGraph}
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
          padding={{ bottom: 40, top: !stackedView ? 80 : stackedView && isTopGraph ? 80 : 0 }} // TODO: Move to graph styles or axes hook
          tickFormatter={value => `${value}%`}
        />

        <Tooltip content={isTopGraph ? SleepSessionTooltip : <div />} />

        <CartesianGrid
          strokeDasharray="3 10"
          stroke='rgba(255, 255, 255, 0.2)'
        />
      </LineChart>
    </ResponsiveContainer>
  )
}