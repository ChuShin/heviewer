import React, { Component } from 'react'
import './App.css'
import GenomeLoad from './components/GenomeLoad'

class App extends Component {
  render() {
  return (
     <div className='App'>
     <div className='App-header'>
     <h4>dashboard</h4>
     </div>
     <GenomeLoad />
     </div>
  )
  }
}
export default App

