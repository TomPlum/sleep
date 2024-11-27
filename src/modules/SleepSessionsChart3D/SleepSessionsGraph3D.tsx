import { ForceGraph3D } from 'react-force-graph'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { AxesHelper, CanvasTexture, Sprite, SpriteMaterial } from 'three'
import { useSleepContext } from 'context/SleepContext'
import { SleepMetric } from 'modules/ChartControls'
import { ForceGraphMethods, LinkConfig, NodeConfig } from './types'
import { useStats } from 'modules/SleepSessionsChart3D/hooks/useStats'
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass'
import dayjs from 'dayjs'
import { getMetricColour } from 'modules/MetricLineChart/hooks/useGraphStyles'

export const SleepSessionsGraph3D = () => {
  const graphRef = useRef<ForceGraphMethods>()
  const { graphData2d } = useSleepContext()

  const [chartData, setChartData] = useState(graphData2d.data.slice(graphData2d.data.length - 50, graphData2d.data.length - 1))

  useStats()

  useEffect(() => {
   if (graphRef.current) {
     const graph = graphRef.current

     const bloomPass = new UnrealBloomPass()
     bloomPass.strength = 4
     bloomPass.radius = 1
     bloomPass.threshold = 0
     graph.postProcessingComposer().addPass(bloomPass)

     const scene = graph.scene()
     const axesHelper = new AxesHelper(5000)
     scene.add(axesHelper)

     // Add axis labels as Sprites
     const addLabel = (text: string, position: [number, number, number]) => {
       const canvas = document.createElement('canvas')
       const context = canvas.getContext('2d')!
       context.font = '80px Arial'
       context.fillStyle = 'white'
       context.fillText(text, 50, 50) // Adjust the text position on the canvas

       const texture = new CanvasTexture(canvas)
       const spriteMaterial = new SpriteMaterial({ map: texture })
       const sprite = new Sprite(spriteMaterial)
       sprite.scale.set(10, 5, 1) // Adjust the label size
       sprite.position.set(...position)
       scene.add(sprite)
     }

     // Add labels to the axes
     addLabel('X', [100, 0, 0])  // Label for X-axis
     addLabel('Y', [0, 100, 0])  // Label for Y-axis
     addLabel('Z', [0, 0, 100])  // Label for Z-axis
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
    <ForceGraph3D
      // @ts-expect-error to fix later if I come back
      ref={graphRef}
      nodeLabel={data => `${data.date} (${data.quality}%)`}
      linkColor='white'
      nodeColor={nodeColour}
      graphData={graphData}
      backgroundColor='#010101'
    />
  )
}