import {ForceGraph3D} from 'react-force-graph'
import {useMemo, useRef} from "react";
import {useSleepData} from "data/useSleepData";

export const SleepSessionsGraph = () => {
  const ref = useRef()
  const { sleepData, loading } = useSleepData()
  console.log(sleepData)

  const graphData = useMemo(() => {
    return sleepData?.sessions.map(sleepDatum => {
      return {
        nodes: [
          { id: 'test', group: 1}
        ],
        links: [
          {
            source: 'test',
            target: 'test',
            value: 1
          }
        ]
      }
    })
  }, [sleepData?.sessions])

  if (loading) {
    return 'Loading...'
  }

  return (
      <ForceGraph3D
        ref={ref}
        graphData={graphData}
      />
  )
}