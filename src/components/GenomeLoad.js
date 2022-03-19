import React, { useState, useEffect } from 'react'
import Loader from "react-loader-spinner";
import { csv, tsv } from 'd3-fetch'
import { ascending } from 'd3-array'

import GenomeGroup from './GenomeGroup'
import FileLoader from './FileLoader'

function heFormat(d) {
  return {
    sample: d.sample,
    group: d.group,
    pos: +d.pos,
    geneA: d.geneA,
    covA: parseFloat(d.covA),
    geneB: d.geneB,
    covB: parseFloat(d.covB)
  }
}

const GenomeLoad = () => {
  const [genome, setGenomeData] = useState(null)

  useEffect(() => {
    csv('./data/bna_he.csv',heFormat).then(data => {
      setGenomeData(data)
    })
  }, [])


  if (genome === null) {
    // add a loader timeout in 10s
    return <h3>Loading data..</h3>
  }

  return (
  <div>
  <FileLoader />
  <GenomeGroup data={genome} />
  </div>
  )
}

export default GenomeLoad