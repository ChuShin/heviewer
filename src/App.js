import React, { Component } from 'react'
import './App.css'
import GenomeLoad from './components/GenomeLoad'

class App extends Component {
  render() {
  return (
     <div className='App'>
     <div className='App-header'>
     <h2>dashboard</h2>
     </div>
     <GenomeLoad size={[800,500]} />
     </div>
  )
  }
}
export default App

