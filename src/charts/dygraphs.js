import React, { useRef, useEffect } from 'react'
import { data } from '../data'
import Dygraph from 'dygraphs'

export const DygraphChart = () => {
  const ref = useRef()
  useEffect(() => {
    const formatted = data.speed.map(({ time, value }) => [
      new Date(time * 1000),
      value,
    ])
    console.log(formatted)
    new Dygraph(ref.current, formatted, {
      legend: 'always',
      //title: 'NYC vs. SF',
      // showRoller: true,
      // rollPeriod: 100000,
      //customBars: true,
      //ylabel: 'Temperature (F)',
      labels: ['x', 'A'],
    })
  }, [])
  return <div ref={ref} />
}
