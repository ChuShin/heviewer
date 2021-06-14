import React, { useState, useEffect } from 'react'
import Loader from "react-loader-spinner";
import { csv } from 'd3-fetch'
import { ascending } from 'd3-array'

import GenomeGroup from './GenomeGroup'

function inputFormat(d) {
  return {
    chr: d.chr,
    start: +d.start,
    end: +d.end,
    value: +d.value
  }
}

function filterData(data) {
  return data.filter(d => {
    return d.revenue > 0
  })
}

function formatData(data) {
  // usually more wrangling is required but the example data is simple
  return data
}

const GenomeLoad = () => {
  const [genome, setGenomeData] = useState(null)

  useEffect(() => {
    csv('./heviewer/data/bna.csv', inputFormat).then(data => {
      //const dataClean = filterData(data)
      setGenomeData(
        formatData(data).sort((a, b) => {
          return ascending(a.chr, b.chr)
        }),
      )
    })
  }, [])

  if (genome === null) {
    // add a loader timeout in 10s
    return <Loader type="Oval" color="#00BFFF" height={100} width={100} timeout={10000} />
  }

  return <GenomeGroup data={genome} />
}

export default GenomeLoad