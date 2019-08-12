import React from 'react'
import ReactDOM from 'react-dom'

import 'antd/dist/antd.css'
import './styles.css'

import { DygraphChart } from './charts/dygraphs'
import { ReactVis01 } from './charts/react-vis'

function App() {
  return (
    <div className="App">
      {/* <h2>Dygraphs</h2>
      <DygraphChart /> */}
      <ReactVis01 />
    </div>
  )
}

const rootElement = document.getElementById('root')
ReactDOM.render(<App />, rootElement)
