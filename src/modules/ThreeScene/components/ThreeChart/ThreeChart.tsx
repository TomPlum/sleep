import ForceGraph3D from 'react-force-graph-3d'
import { forwardRef, useCallback, useEffect, useImperativeHandle, useMemo, useRef } from 'react'
import { Mesh, MeshStandardMaterial, SphereGeometry } from 'three'
import { useSleepContext } from 'context/SleepContext'
import { SleepMetric } from 'modules/ChartControls'
import { LinkConfig, NodeConfig } from '../../types'
import { useStats } from 'modules/ThreeScene/hooks/useStats'
// import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass'
import dayjs from 'dayjs'
import { getMetricColour } from 'modules/MetricLineChart/hooks/useGraphStyles'
import { useThreeAxis } from 'modules/ThreeScene/hooks/useThreeAxis'
import { useThreeConfigContext } from 'context/ThreeConfigContext'
import { ThreeChartRef } from './types'
import { ForceGraph3DInstance } from '3d-force-graph'

export const ThreeChart = forwardRef<ThreeChartRef>((_props, ref) => {
  const { graphData2d: { data }  } = useSleepContext()
  const { draggableNodes, setResettingCamera } = useThreeConfigContext()

  const graphRef = useRef<ForceGraph3DInstance>()

  useImperativeHandle(ref, () => ({
    ...graphRef.current,
    resetCamera: () => {
      graphRef.current?.cameraPosition(
        { x: 0, y: 0, z: 0 },
        undefined,
        1000
      )

      console.log(graphRef.current?.controls())

      setTimeout(() => {
        setResettingCamera(false)
      }, 1000)
    }
  }))

  useEffect(() => {
    graphRef?.current?.refresh()
  }, [draggableNodes])

  useStats()
  useThreeAxis({ graphRef })

/*  useEffect(() => {
   if (graphRef.current) {
     const graph = graphRef.current

     const bloomPass = new UnrealBloomPass()
     bloomPass.strength = 4
     bloomPass.radius = 1
     bloomPass.threshold = 0
     graph.postProcessingComposer().addPass(bloomPass)
   }
  }, [])*/

  const graphData = useMemo(() => {
    const nodes: NodeConfig[] = []
    const links: LinkConfig[] = []
    const rootIds: Record<number, string> = {}

    data.forEach((session, i) => {
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
          quality: session[SleepMetric.DEEP_SLEEP]
        }
      ]

      metricNodes.filter(node => node.quality > 0).forEach(metricNode => {
        nodes.push(metricNode)

        links.push({
          source: sessionRootNode.id,
          target: metricNode.id,
          value: 0
        })
      })

      if (i > 0 && i < data.length) {
        // Link the last root node to this sessions root node
        links.push({
          source: rootIds[i - 1],
          target: sessionRootNode.id,
          value: 1,
          showDirectionalArrow: true
        })
      }
    })

    return {
      nodes,
      links
    }
  }, [data])

  const nodeColour = useCallback((node: NodeConfig ) => {
    if (!node.metric) {
      return 'white'
    }

    return getMetricColour(node.metric)
  }, [])

  return (
    <ForceGraph3D
      linkWidth={1}
      // @ts-expect-error to fix later if I come back
      ref={graphRef}
      linkColor='white'
      graphData={graphData}
      nodeColor={nodeColour}
      cooldownTime={1500}
      linkCurvature={0.25}
      backgroundColor='#010101'
      linkDirectionalArrowRelPos={1}
      enableNodeDrag={draggableNodes}
      linkDirectionalParticles='value'
      linkDirectionalParticleWidth={3}
      linkDirectionalParticleSpeed={d => d.value * 0.010}
      nodeLabel={data => `${data.date} (${data.quality}%)`}
      linkDirectionalArrowLength={link => link.showDirectionalArrow ? 8 : 0}
      nodeThreeObject={(node: NodeConfig) => {
        const radius = !node.metric ? 5 : Math.sqrt(node.quality)
        return new Mesh(
          new SphereGeometry(radius),
          new MeshStandardMaterial({ color: nodeColour(node) })
        )
      }}
    />
  )
})

ThreeChart.displayName = 'SleepSessionsGraph3D'