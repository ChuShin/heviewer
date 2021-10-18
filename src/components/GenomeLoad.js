import React, { useState, useEffect } from 'react'
import Loader from "react-loader-spinner";
import { csv, tsv } from 'd3-fetch'
import { ascending } from 'd3-array'

import GenomeGroup from './GenomeGroup'

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
    return <Loader type="Oval" color="#00BFFF" height={100} width={100} timeout={100000} />
  }

  return <GenomeGroup data={genome} />
}

export default GenomeLoad