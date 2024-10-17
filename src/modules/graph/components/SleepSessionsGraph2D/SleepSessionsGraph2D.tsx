import {
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
import { CustomYAxisTick } from 'modules/graph/components/CustomYAxisTick'
import { SleepSessionTooltip } from 'modules/graph/components/SleepSessionTooltip'
import { CustomXAxisTick } from 'modules/graph/components/CustomXAxisTick'
import { useGraphStyles } from 'modules/graph/hooks/useGraphStyles'
import { useSleepContext } from 'context'
import styles from './SleepSessionGraph2D.module.scss'
import { useTypicalSession } from 'modules/graph/hooks/useTypicalSession/useTypicalSession'
import { useTranslation } from 'react-i18next'
import { useAxes2D } from 'modules/graph/hooks/useAxes2D'

export const SleepSessionsGraph2D = () => {
  const { xTicks, yTicks, xAxisInterval, yDomain } = useAxes2D()
  const { t } = useTranslation('translation', { keyPrefix: 'sleep.graph2d' })
  const { typicalSleepSession , typicalSleepSessionFill } = useTypicalSession()
  const { currentMetricColour, strokeWidth, activeDotRadius } = useGraphStyles()
  const { graphData2d: { data, earliestSession, latestSession }, sleepMetric } = useSleepContext()

  const {
    regressionLineData,
    regressionDataKey,
    regressionDelta,
    yRegressionDeltaLine,
    regressionLineDeltaVertical
  } = useLinearRegression()

  return (
    <ResponsiveContainer width='100%' height='100%'>
      <LineChart
        id='sleeps-sessions-graph-2d'
        margin={{ left: -55, bottom: -22 }}
      >
        <Line
          data={data}
          type='monotone'
          dataKey={sleepMetric}
          animationDuration={500}
          isAnimationActive={true}
          strokeWidth={strokeWidth}
          id={`${sleepMetric}_line`}
          stroke={currentMetricColour}
          animationEasing='ease-in-out'
          className={styles.metricLine}
          dot={{ fill: undefined, r: activeDotRadius }}
        />

        <Line
          dot={false}
          type='monotone'
          animationDuration={500}
          isAnimationActive={true}
          strokeWidth={strokeWidth}
          stroke='rgb(255, 255, 255)'
          dataKey={regressionDataKey}
          animationEasing='ease-in-out'
          id={`${sleepMetric}_regression_line`}
          data={regressionLineData.map(({ y, xDate }) => ({
            xDate,
            [sleepMetric]: y,
          }))}
        />

        <ReferenceLine
          type='monotone'
          strokeWidth={1}
          strokeDasharray='10 15'
          y={yRegressionDeltaLine}
          stroke='rgb(255, 255, 255)'
          id={`${sleepMetric}_regression_line_delta_h`}
        >
          <Label
            offset={10}
            position='insideBottomRight'
            value={`Δ ${regressionDelta}%`}
          />
        </ReferenceLine>

        <Line
          dot={false}
          dataKey='y'
          type='monotone'
          strokeWidth={2}
          strokeDasharray='10 15'
          isAnimationActive={false}
          stroke='rgb(255, 255, 255)'
          data={regressionLineDeltaVertical}
          id={`${sleepMetric}_regression_line_delta_v`}
        />

        {typicalSleepSession && (
          <ReferenceArea
            {...typicalSleepSession}
            isUpdateAnimationActive
            isAnimationActive
            ifOverflow='extendDomain'
            fill={typicalSleepSessionFill}
            id={`${sleepMetric}_typical_sleep_session_area`}
          >
            <Label
              offset={10}
              position='insideTopLeft'
              value={t('typical-sleep-session')}
            />
          </ReferenceArea>
        )}

        <XAxis
          type='number'
          scale='time'
          dataKey='xDate'
          strokeWidth={3}
          ticks={xTicks}
          axisLine={false}
          padding={{ left: -5 }}
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
          domain={[earliestSession.getTime(), latestSession.getTime()]}
        />

        <YAxis
          ticks={yTicks}
          strokeWidth={3}
          axisLine={false}
          domain={yDomain}
          orientation='left'
          dataKey={sleepMetric}
          tick={CustomYAxisTick}
          stroke='rgb(255, 255, 255)'
          padding={{ bottom: 40, top: 80 }}
          tickFormatter={value => `${value}%`}
        />

        <Tooltip content={SleepSessionTooltip} />
      </LineChart>
    </ResponsiveContainer>
  )
}