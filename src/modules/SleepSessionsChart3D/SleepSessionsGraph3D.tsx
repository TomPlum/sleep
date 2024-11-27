import { ForceGraph3D } from 'react-force-graph'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Mesh, MeshStandardMaterial, SphereGeometry } from 'three'
import { useSleepContext } from 'context/SleepContext'
import { SleepMetric } from 'modules/ChartControls'
import { ForceGraphMethods, LinkConfig, NodeConfig } from './types'
import { useStats } from 'modules/SleepSessionsChart3D/hooks/useStats'
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass'
import dayjs from 'dayjs'
import { getMetricColour } from 'modules/MetricLineChart/hooks/useGraphStyles'
import { ThreeControls } from 'modules/SleepSessionsChart3D/components/ThreeControls'
import styles from './SleepSessionsChart3D.module.scss'
import { useThreeAxis } from 'modules/SleepSessionsChart3D/hooks/useThreeAxis'
import { useThreeConfigContext } from 'context/ThreeConfigContext'

export const SleepSessionsGraph3D = () => {
  const { graphData2d } = useSleepContext()
  const { draggableNodes } = useThreeConfigContext()

  const graphRef = useRef<ForceGraphMethods>()

  const [chartData, setChartData] = useState(graphData2d.data.slice(graphData2d.data.length - 50, graphData2d.data.length - 1))

  useEffect(() => {
    graphRef.current?.refresh()
  }, [draggableNodes])

  useStats()
  useThreeAxis({ graphRef })

  useEffect(() => {
   if (graphRef.current) {
     const graph = graphRef.current

     const bloomPass = new UnrealBloomPass()
     bloomPass.strength = 4
     bloomPass.radius = 1
     bloomPass.threshold = 0
     graph.postProcessingComposer().addPass(bloomPass)
   }
  }, [])

  const graphData = useMemo(() => {
    const nodes: NodeConfig[] = []
    const links: LinkConfig[] = []
    const rootIds: Record<number, string> = {}

    chartData.forEach((session, i) => {
      const x = i * 50
      const y = 0

      const sessionRootNode = {
        id: `${session.id}-session-root`,
        x,
        y,
        z: 0,
        date: dayjs(session.date).format('YYYY-MM-DD'),
        quality: session[SleepMetric.QUALITY]
      }

      rootIds[i] = sessionRootNode.id

      nodes.push(sessionRootNode)

      const metricNodes = [
        {
          id: `${session.id}-quality`,
          metric: SleepMetric.QUALITY,
          x,
          y,
          z: 10,
          date: dayjs(session.date).format('YYYY-MM-DD'),
          quality: session[SleepMetric.QUALITY]
        },
        {
          id: `${session.id}-duration`,
          metric: SleepMetric.DURATION,
          x: x + 10,
          y,
          z: -10,
          date: dayjs(session.date).format('YYYY-MM-DD'),
          quality: session[SleepMetric.QUALITY]
        },
        {
          id: `${session.id}-awake`,
          metric: SleepMetric.AWAKE_TIME,
          x: x - 10,
          y,
          z: -5,
          date: dayjs(session.date).format('YYYY-MM-DD'),
          quality: session[SleepMetric.AWAKE_TIME]
        },
        {
          id: `${session.id}-rem`,
          metric: SleepMetric.REM_SLEEP,
          x: x - 10,
          y: y + 5,
          z: -5,
          date: dayjs(session.date).format('YYYY-MM-DD'),
          quality: session[SleepMetric.REM_SLEEP]
        },
        {
          id: `${session.id}-light`,
          metric: SleepMetric.LIGHT_SLEEP,
          x: x + 10,
          y: y - 5,
          z: 5,
          date: dayjs(session.date).format('YYYY-MM-DD'),
          quality: session[SleepMetric.LIGHT_SLEEP]
        },
        {
          id: `${session.id}-deep`,
          metric: SleepMetric.DEEP_SLEEP,
          x: x + 10,
          y: y - 5,
          z: 5,
          date: dayjs(session.date).format('YYYY-MM-DD'),
          quality: session[SleepMetric.LIGHT_SLEEP]
        }
      ]

      metricNodes.forEach(metricNode => {
        nodes.push(metricNode)

        links.push({
          source: sessionRootNode.id,
          target: metricNode.id,
          value: session[SleepMetric.QUALITY]
        })
      })

      if (i > 0 && i < chartData.length) {
        links.push({
          source: rootIds[i - 1],
          target: sessionRootNode.id,
          value: session[SleepMetric.QUALITY]
        })
      }
    })

    return {
      nodes,
      links
    }
  }, [chartData])

  console.log('graphData', graphData)

  const nodeColour = useCallback((node: NodeConfig ) => {
    if (!node.metric) {
      return 'white'
    }

    return getMetricColour(node.metric)
  }, [])

  return (
    <div className={styles.container}>
      <ThreeControls />
      
      <ForceGraph3D
        // @ts-expect-error to fix later if I come back
        ref={graphRef}
        nodeLabel={data => `${data.date} (${data.quality}%)`}
        linkColor='white'
        nodeColor={nodeColour}
        graphData={graphData}
        backgroundColor='#010101'
        enableNodeDrag={draggableNodes}
        nodeThreeObject={(node: NodeConfig) => {
          const radius = !node.metric ? 5 : Math.sqrt(node.quality)
          return new Mesh(
            new SphereGeometry(radius),
            new MeshStandardMaterial({ color: nodeColour(node) })
          )
        }}
      />
    </div>
  )
}