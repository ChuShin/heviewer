import React, { Component }  from 'react';
import './index.css'
import GenomeLoad from './components/GenomeLoad'

const App = () => {
  return (
    <div>
       <div className='header'>
         HExviewer
       </div>
       <div className='heContainer'>
         <GenomeLoad />
       </div>
    </div>
  )
}
export default App

