import _ from 'lodash'
import moment from 'moment'

// const _data = {
//   speed: [
//     {
//       time: 156559347,
//       value: 45,
//     },
//   ],
//   temperature: [
//     {
//       time: 156559347,
//       value: 17.5,
//     },
//   ],
// }

function generateData({min = 17, max = 45, resolutionMinutes = 6, withDataLoss = false} = {}) {
	const now = Math.round(moment().unix() / (resolutionMinutes * 6)) * resolutionMinutes * 6
	return _.range(0, 200).map(i => ({
		time: moment
			.unix(now)
			.subtract(i * resolutionMinutes, 'm')
			.unix(),
		value: _.random(min, max, true),
		data_loss: withDataLoss ? _.random(0, 1, true) : undefined,
	}))
}

const elaboratedData = {
	speed: generateData({min: 17, max: 30, resolutionMinutes: 1, withDataLoss: true}),
	temperature: generateData({min: 19, max: 47, resolutionMinutes: 1, withDataLoss: true}),
}
const rawData = {
	speed: elaboratedData.speed
		.filter(d => d.time % 6 === 0 && d.data_loss < 0.5)
		.map(({data_loss, ...d}) => d),
	temperature: elaboratedData.temperature
		.filter(d => d.time % 6 === 0 && d.data_loss < 0.5)
		.map(({data_loss, ...d}) => d),
}

export const data = {
	raw: rawData,
	elaborated: elaboratedData,
}
