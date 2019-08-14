import React, {useState, useEffect} from 'react'
import {DatePicker, Button} from 'antd'
import moment from 'moment'

const AntRangePicker = DatePicker.RangePicker

const TIME_FORMAT = 'HH:mm'
const MINUTE_STEP = 6

const RangePicker = ({value, onChange}) => {
	const [range, setRange] = useState(value || [null, null])
	useEffect(() => setRange(value), [value])
	return (
		<AntRangePicker
			value={range}
			showTime={{
				hideDisabledOptions: true,
				format: TIME_FORMAT,
				minuteStep: MINUTE_STEP,
			}}
			format="YYYY-MM-DD HH:mm"
			onChange={v => {
				console.log('onChange')
				setRange(v)
			}}
			onOk={v => {
				console.log('onOk')
				onChange(v)
			}}
			onOpenChange={open => {
				console.log('onOpenChange', open)
				setRange(value)
			}}
		/>
	)
}

export const RangeSelector = ({value, onChange, onReset}) => {
	return (
		<div>
			<RangePicker onChange={range => onChange(range)} value={value} />
			{/* <Button type="link" onClick={_e => onReset()}>
				Reset
			</Button> */}
			<Button
				type="link"
				onClick={_e => {
					const d = value[1].diff(value[0])
					onChange([value[0].subtract(d), value[1].subtract(d)])
				}}
			>
				{'<'}
			</Button>
			<Button
				type="link"
				onClick={_e => {
					const d = value[1].diff(value[0])
					onChange([value[0].add(d), value[1].add(d)])
				}}
			>
				{'>'}
			</Button>
			<Button
				type="link"
				onClick={_e => {
					onChange([moment().subtract(30, 'm'), moment()])
				}}
			>
				last 30 mins
			</Button>
			<Button
				type="link"
				onClick={_e => {
					onChange([moment().subtract(1, 'h'), moment()])
				}}
			>
				last hour
			</Button>
			<Button
				type="link"
				onClick={_e => {
					onChange([moment().subtract(3, 'h'), moment()])
				}}
			>
				last 3 hours
			</Button>
			<Button
				type="link"
				onClick={_e => {
					onChange([moment().subtract(6, 'h'), moment()])
				}}
			>
				last 6 hours
			</Button>
			<Button
				type="link"
				onClick={_e => {
					onChange([moment().subtract(12, 'h'), moment()])
				}}
			>
				last 12 hours
			</Button>
			<Button
				type="link"
				onClick={_e => {
					onChange([moment().subtract(24, 'h'), moment()])
				}}
			>
				last 24 hours
			</Button>
			<Button
				type="link"
				onClick={_e => {
					onChange([
						moment()
							.endOf('d')
							.subtract(1, 'w'),
						moment().endOf('d'),
					])
				}}
			>
				last week
			</Button>
		</div>
	)
}

export default RangePicker
