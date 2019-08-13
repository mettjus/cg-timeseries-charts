import React, { useState, useMemo } from 'react'
import {
  XYPlot,
  XAxis,
  YAxis,
  ChartLabel,
  HorizontalGridLines,
  VerticalGridLines,
  LineSeries,
  LineSeriesCanvas,
  Crosshair,
  VerticalRectSeries,
  Highlight,
  MarkSeries,
  PolygonSeries,
  Borders,
} from 'react-vis'
import moment from 'moment'
import _ from 'lodash'
import { DatePicker, TimePicker } from 'antd'
import color from 'color'

import 'react-vis/dist/style.css'

import { data } from '../data'

const Line = LineSeries
// const Line = LineSeriesCanvas

export const Chart = ({ step = null, onBrushEnd, xDomain } = {}) => {
  const gap = 60
  let curve, stepGetter
  switch (step) {
    case 'middle':
      curve = 'curveStep'
      stepGetter = time => ({
        x0: new Date((time - 180 + gap / 2) * 1000),
        x: new Date((time + 180 - gap / 2) * 1000),
      })
      break
    case 'start':
      curve = 'curveStepAfter'
      stepGetter = time => ({
        x0: new Date((time + gap / 2) * 1000),
        x: new Date((time + 360 - gap / 2) * 1000),
      })
      break

    default:
      curve = undefined
      stepGetter = time => ({
        x0: new Date((time - 180 + gap / 2) * 1000),
        x: new Date((time + 180 - gap / 2) * 1000),
      })
      break
  }
  const [hoveredItem, setHoveredItem] = useState(null)
  const _data = data.speed
  const crosshairValues = useMemo(
    () =>
      hoveredItem ? [{ x: hoveredItem.x, ..._data[hoveredItem.index] }] : [],
    [_data, hoveredItem],
  )
  const _times = _data.map(d => d.time)
  const _xDomain = [
    xDomain[0] || new Date(_.min(_times) * 1000),
    xDomain[1] || new Date(_.max(_times) * 1000),
  ]
  const _values = _data.map(d => d.value)
  const domain = [_.min(_values), _.max(_values)]

  const renderStep = () => {
    if (!hoveredItem) return null
    const { time, value } = _data[hoveredItem.index]
    const color = 'rgb(121, 199, 227)'
    switch (step) {
      case 'start':
        return (
          <PolygonSeries
            style={{
              stroke: color,
              strokeWidth: 4,
              //strokeLinecap: 'round',
              //strokeLinecap: 'square',
              //'stroke-linecap': 'square',
              //strokeLinecap: 'butt',
            }}
            data={[
              {
                x: new Date(time * 1000),
                y: value,
              },
              {
                x: new Date((time + 360) * 1000),
                y: value,
              },
            ]}
          />
        )
      case 'middle':
        return (
          <PolygonSeries
            style={{
              stroke: color,
              strokeWidth: 4,
              //strokeLinecap: 'round',
              //strokeLinecap: 'square',
              //'stroke-linecap': 'square',
              //strokeLinecap: 'butt',
            }}
            data={[
              {
                x: new Date((time - 180) * 1000),
                y: value,
              },
              {
                x: new Date((time + 180) * 1000),
                y: value,
              },
            ]}
          />
        )
      default:
        return (
          <MarkSeries
            color={color}
            size={3}
            data={[
              {
                x: new Date(time * 1000),
                y: value,
              },
            ]}
          />
        )
    }
  }
  const Wrapper = ({ children }) => <g>{children}</g>
  return (
    <>
      {/* JSON.stringify({ xDomain, _xDomain }) */}
      <XYPlot
        //animation
        xDomain={_xDomain}
        xType="time"
        width={500}
        height={300}
        onMouseLeave={() => setHoveredItem(null)}
        //yDomain={domain}
        yDomain={domain}
        range={domain}
      >
        <HorizontalGridLines />
        <VerticalGridLines />
        {/* <ChartLabel
        text="Speed"
        className="alt-y-label"
        includeMargin={false}
        xPercent={0.06}
        yPercent={0.06}
        // style={{
        //   transform: 'rotate(-90)',
        //   textAnchor: 'end',
        // }}
      /> */}
        <VerticalRectSeries
          //yDomain={[0, 1]}
          color={'rgba(255,0,0,.1)'}
          //color={d => `rgba(255,0,0,.2)`}
          stroke={null}
          // style={{
          //   stroke: null,
          //   fill: d => 'red',
          // }}
          data={_data.map(({ time, data_loss }) => ({
            ...stepGetter(time),
            y0: domain[0],
            y: domain[0] + data_loss * (domain[1] - domain[0]),
            //fill: color('green').rgbNumber(),
            //color: 0.3,
            // stroke: d => {
            //   console.log('helo')
            //   return 'fucsia'
            // },
          }))}
        />
        <Line
          strokeWidth={1.2}
          onNearestX={({ x }, { index }) => {
            setHoveredItem(
              x <= _xDomain[1] && x >= _xDomain[0] ? { x, index } : null,
            )
          }}
          className="first-series"
          data={_data.map(({ time, value }) => ({
            x: new Date(time * 1000),
            y: value,
          }))}
          curve={curve}
          // style={{
          //   position: 'absolute',
          //   clip: 'rect(300px, 500px, 190px, 10px)',
          // }}
        />
        {/*hoveredItem && (
          <MarkSeries
            data={[_data[hoveredItem.index]].map(({ time, value }) => ({
              x: new Date(time * 1000),
              y: value,
            }))}
          />
          )*/}
        {renderStep()}
        <Borders
          style={{
            bottom: { fill: 'none' },
            left: { fill: '#fff' },
            right: { fill: '#fff' },
            top: { fill: 'none' },
          }}
        />
        <XAxis />
        <YAxis />
        <Highlight
          onBrushEnd={brush => onBrushEnd && onBrushEnd(brush)}
          enableY={false}
        />
        {crosshairValues[0] && (
          <Crosshair values={crosshairValues} className="timeseries-crosshair">
            <div
              className="rv-crosshair__inner__content"
              style={{
                backgroundColor: 'rgba(0,0,0,.6)',
                margin: 8,
              }}
            >
              <table>
                <tbody>
                  <tr>
                    <th>Time</th>
                    <td>
                      {moment(crosshairValues[0].time).format(
                        'YYYY-MM-DD hh:mm',
                      )}
                    </td>
                  </tr>
                  <tr>
                    <th>Speed</th>
                    <td>{crosshairValues[0].value}</td>
                  </tr>
                  <tr>
                    <th>Loss</th>
                    <td>{Math.round(crosshairValues[0].data_loss * 100)}%</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </Crosshair>
        )}
      </XYPlot>
    </>
  )
}

export const ReactVis01 = () => {
  const timeFormat = 'HH:mm'
  const [tmpTimeRange, setTmpTimeRange] = useState([
    moment('2019-05-01T00:00:00.000Z'),
    null,
  ])
  const [timeRange, setTimeRange] = useState([null, null])
  const onBrushEnd = brush => {
    console.log(brush)
    setTmpTimeRange([moment(brush.left), moment(brush.right)])
    setTimeRange([moment(brush.left), moment(brush.right)])
  }
  return (
    <>
      <h2>ReactVis</h2>
      <DatePicker
        placeholder="Select start time"
        showTime={{
          minuteStep: 6,
          format: timeFormat,
          defaultValue: moment('00:00', timeFormat),
        }}
        onChange={value => {
          setTmpTimeRange([value, tmpTimeRange[1]])
          if (!value) setTimeRange([null, timeRange[1]])
        }}
        onOk={value => setTimeRange([value.toDate(), timeRange[1]])}
        value={tmpTimeRange[0]}
      />
      <DatePicker
        placeholder="Select end time"
        showTime={{
          minuteStep: 6,
          format: timeFormat,
          defaultValue: moment('00:00', timeFormat),
        }}
        onChange={value => setTmpTimeRange([tmpTimeRange[0], value])}
        onChange={value => {
          setTmpTimeRange([tmpTimeRange[0], value])
          if (!value) setTimeRange([timeRange[0], null])
        }}
        onOk={value => setTimeRange([timeRange[0], value])}
        value={tmpTimeRange[1]}
      />
      <br />
      {JSON.stringify(timeRange)}
      <div style={{ display: 'flex' }}>
        <div>
          <h4>Senza gradini</h4>
          <br />
          <Chart xDomain={timeRange} onBrushEnd={onBrushEnd} />
        </div>
        <div>
          <h4>Gradini con datapoint all'inizio</h4>
          <b>QUESTO PROBABILMENTE È QUELLO CHE HA MENO SENSO</b>
          <Chart xDomain={timeRange} onBrushEnd={onBrushEnd} step="start" />
        </div>
        <div>
          <h4>Gradini con datapoint al centro</h4>
          <br />
          <Chart xDomain={timeRange} onBrushEnd={onBrushEnd} step="middle" />
        </div>
      </div>
    </>
  )
}
