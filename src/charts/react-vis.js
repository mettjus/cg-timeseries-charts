import React, {useState, useMemo} from 'react'
import {
	XYPlot,
	XAxis,
	YAxis,
	HorizontalGridLines,
	VerticalGridLines,
	LineSeries,
	Crosshair,
	VerticalRectSeries,
	Highlight,
	MarkSeries,
	PolygonSeries,
	Borders,
} from 'react-vis'
import moment from 'moment'
import _ from 'lodash'

import 'react-vis/dist/style.css'

import {data} from '../data'
import {RangeSelector} from '../range-picker'

const Line = LineSeries
const LINE_COLOR = 'rgb(18, 147, 154)'

export const Chart = ({
	data,
	step = null,
	onBrushEnd,
	resolutionMins,
	xDomain,
	showDataLoss = false,
} = {}) => {
	const stepLength = resolutionMins * 60
	const gap = stepLength / 5
	let curve, stepGetter
	switch (step) {
		case 'middle':
			curve = 'curveStep'
			stepGetter = time => ({
				x0: new Date((time - stepLength / 2 + gap / 2) * 1000),
				x: new Date((time + stepLength / 2 - gap / 2) * 1000),
			})
			break
		default:
			curve = undefined
			stepGetter = time => ({
				x0: new Date((time - stepLength / 2 + gap / 2) * 1000),
				x: new Date((time + stepLength / 2 - gap / 2) * 1000),
			})
			break
	}
	const [hoveredItem, setHoveredItem] = useState(null)
	const crosshairValues = useMemo(
		() => (hoveredItem ? [{x: hoveredItem.x, ...data[hoveredItem.index]}] : []),
		[data, hoveredItem]
	)
	const _times = data.map(d => d.time)
	const _xDomain = [
		xDomain[0] || new Date(_.min(_times) * 1000),
		xDomain[1] || new Date(_.max(_times) * 1000),
	]
	const _values = data.map(d => d.value)
	const domain = [_.min(_values), _.max(_values)]

	const renderStep = ({xDomain}) => {
		if (!hoveredItem) return null
		const {time, value} = data[hoveredItem.index]
		const color = LINE_COLOR
		switch (step) {
			case 'start':
				return (
					<PolygonSeries
						style={{
							stroke: color,
							strokeWidth: 4,
						}}
						data={[
							{
								x: new Date((time - stepLength) * 1000),
								y: value,
							},
							{
								x: new Date(time * 1000),
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
						}}
						data={[
							{
								x: new Date((time - stepLength / 2) * 1000),
								y: value,
							},
							{
								x: new Date((time + stepLength / 2) * 1000),
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
	return (
		<>
			<XYPlot
				xDomain={_xDomain}
				xType="time"
				width={500}
				height={300}
				onMouseLeave={() => setHoveredItem(null)}
				yDomain={domain}
				range={domain}
			>
				<HorizontalGridLines />
				<VerticalGridLines />
				{showDataLoss && (
					<VerticalRectSeries
						color={'rgba(255,0,0,.1)'}
						stroke={null}
						data={data.map(({time, data_loss}) => ({
							...stepGetter(time),
							y0: domain[0],
							y: domain[0] + data_loss * (domain[1] - domain[0]),
						}))}
					/>
				)}
				<Line
					strokeWidth={1.2}
					color={LINE_COLOR}
					onNearestX={({x}, {index}) => {
						setHoveredItem(x <= _xDomain[1] && x >= _xDomain[0] ? {x, index} : null)
					}}
					data={data.map(({time, value}) => ({
						x: new Date(time * 1000),
						y: value,
					}))}
					curve={curve}
				/>
				{renderStep({xDomain: _xDomain})}
				<Borders
					style={{
						bottom: {fill: 'none'},
						left: {fill: '#fff'},
						right: {fill: '#fff'},
						top: {fill: 'none'},
					}}
				/>
				<XAxis />
				<YAxis />
				<Highlight onBrushEnd={brush => onBrushEnd && onBrushEnd(brush)} enableY={false} />
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
										<td>{moment(crosshairValues[0].time * 1000).format('YYYY-MM-DD hh:mm')}</td>
									</tr>
									<tr>
										<th>Speed</th>
										<td>{crosshairValues[0].value}</td>
									</tr>
									{showDataLoss && (
										<tr>
											<th>Loss</th>
											<td>{Math.round(crosshairValues[0].data_loss * 100)}%</td>
										</tr>
									)}
								</tbody>
							</table>
						</div>
					</Crosshair>
				)}
			</XYPlot>
		</>
	)
}

export const ReactVis01 = ({initialInterval = [moment().subtract(24, 'h'), moment()]} = {}) => {
	const [timeRange, setTimeRange] = useState(initialInterval)
	const onBrushEnd = brush => {
		console.log(brush)
		setTimeRange([moment(brush.left), moment(brush.right)])
	}
	return (
		<>
			<RangeSelector
				value={timeRange}
				onChange={range => setTimeRange(range)}
				onReset={() => setTimeRange(initialInterval)}
			/>
			<br />
			{JSON.stringify(timeRange)}
			<div style={{display: 'flex'}}>
				<div>
					<h4>Senza gradini</h4>
					<br />
					<Chart
						data={data.raw.speed}
						resolutionMins={6}
						xDomain={timeRange}
						onBrushEnd={onBrushEnd}
					/>
				</div>
				<div>
					<h4>Gradini con datapoint al centro</h4>
					<br />
					<Chart
						data={data.elaborated.speed}
						resolutionMins={1}
						xDomain={timeRange}
						onBrushEnd={onBrushEnd}
						step="middle"
						showDataLoss
					/>
				</div>
			</div>
		</>
	)
}
