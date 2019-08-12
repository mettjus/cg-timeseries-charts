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

function generateData({ min = 17, max = 45 } = {}) {
  return _.range(0, 50).map(i => ({
    time: moment('2019-05-01T00:00:00Z')
      .add(i * 6, 'm')
      .unix(),
    value: _.random(min, max, true),
    data_loss: _.random(0, 1, true),
  }))
}

export const data = {
  speed: generateData({ min: 15, max: 30 }),
  temperature: generateData({ min: 19, max: 47 }),
}

//console.log(JSON.stringify(data, null, 2))
