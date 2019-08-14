import React from 'react'
import ReactDOM from 'react-dom'

import 'antd/dist/antd.css'
import './styles.css'

import { ReactVis01 } from './charts/react-vis'

function App() {
  return (
    <div className="App">
      <h2>Time Series</h2>
      <ReactVis01 />
    </div>
  )
}

const rootElement = document.getElementById('root')
ReactDOM.render(<App />, rootElement)
