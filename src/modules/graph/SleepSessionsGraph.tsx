import { ForceGraph3D } from 'react-force-graph'
import { useCallback, useEffect, useMemo, useRef } from 'react'
import { useSleepData } from 'data/useSleepData'
import { AxesHelper, CanvasTexture, Scene, Sprite, SpriteMaterial } from 'three'

// TODO: Move to types file
interface ForceGraphMethods {
  scene: () => Scene
}

interface LinkConfig {
  source: string
  target: string
  value: number
}

export const SleepSessionsGraph = () => {
  const graphRef = useRef<ForceGraphMethods>()
  const { sleepData, loading } = useSleepData()
  console.log(sleepData)

  useEffect(() => {
   if (graphRef.current) {
     const scene = graphRef.current.scene()

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
    const nodes = sleepData?.sessions.flatMap((session, i) => [
      {
        id: session.id,
        group: 'sleepQuality',
        x: (i + 1) * 50,
        y: session.sleepQuality * 50,
        z: 0
      },
      {
        id: session.id + 'awake',
        group: 'awake',
        x: (i + 1) * 50,
        y: session.duration.awake * 50,
        z: 50
      }
    ])

    const links = sleepData?.sessions.reduce((acc: Array<LinkConfig>, aSession, i) => {
      if (i < sleepData?.sessions.length - 1) {
        const bSession = sleepData?.sessions[i + 1]

        acc.push({
          source: aSession.id,
          target: bSession.id,
          value: bSession.sleepQuality
        })

        acc.push({
          source: aSession.id + 'awake',
          target: bSession.id + 'awake',
          value: bSession.duration.awake
        })

        return acc
      }

      return acc
    }, [])

    return {
      nodes,
      links
    }
  }, [sleepData?.sessions])
  console.log('Graph Data', graphData)

  // @ts-expect-error to fix later if I come back
  const linkColor = useCallback(link => {
    console.log(link.source)
    switch(link.source.group) {
      case 'sleepQuality': {
        return '#9a30fe'
      }
      case 'awake': {
        return '#f89128'
      }
      default: {
        return 'red'
      }
    }
  }, [])

  if (loading) {
    return 'Loading...'
  }

  return (
      <ForceGraph3D
        // @ts-expect-error to fix later if I come back
        ref={graphRef}
        nodeLabel='id'
        nodeAutoColorBy='group'
        d3AlphaMin={0.1}
        d3VelocityDecay={0.9}
        linkColor={linkColor}
        nodeColor='#9a30fe'
        // @ts-expect-error to fix later if I come back
        graphData={graphData}
        backgroundColor='#171717'
      />
  )
}