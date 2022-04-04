import React, { useState, useEffect } from 'react'
import Loader from "react-loader-spinner";
import { csv, tsv } from 'd3-fetch'
import { ascending } from 'd3-array'

import GenomeGroup from './GenomeGroup'
//import FileLoader from './FileLoader'

function heFormat(d) {
  return {
    sample: d.sample,
    group: d.group,
    pos: +d.pos,
    covA: parseFloat(d.covA),
    covB: parseFloat(d.covB)
  }
}

const GenomeLoad = () => {
  const [genome, setGenomeData] = useState(null)

  useEffect(() => {
    // csv('./data/bna_he.csv',heFormat).then(data => {
    //  setGenomeData(data)
    // })
    function handleFileSelect(evt) {
      var file = evt.target.files[0];
      var reader = new FileReader();
      reader.onload = (function(theFile) {
      return function(e) {
        //drawChart(e.target.result);
        console.log(e.target.result)
        csv(e.target.result,heFormat).then(data => {
          setGenomeData(data)
        })
      };
    })(file);
    reader.readAsDataURL(file);
}
document.getElementById('file_input').addEventListener('change', handleFileSelect, false);


  }, [])


  //if (genome === null) {
    // add a loader timeout in 10s
  //  return <h3>Loading data..</h3>
  //}

  return (
  <div>
  <input type="file" id="file_input" accept=".csv"
  />

  <GenomeGroup data={genome} />
  </div>
  )
}

export default GenomeLoad