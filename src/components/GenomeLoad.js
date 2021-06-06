import React, { useState, useEffect } from 'react'
import { csv } from 'd3-fetch'
import { ascending } from 'd3-array'

import GenomeGroup from './GenomeGroup'

const parseNA = string => (string === 'NA' ? undefined : string)

function inputFormat(d) {
  return {
    genre: parseNA(d.genre),
    revenue: +d.revenue,
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
    csv('/data/bna.csv', inputFormat).then(data => {
      const dataClean = filterData(data)
      setGenomeData(
        formatData(dataClean).sort((a, b) => {
          return ascending(a.genre, b.genre)
        }),
      )
    })
  }, [])

  if (genome === null) {
    return <p>Loading...</p>
  }

  return <GenomeLoad data={genome} />
}

export default GenomeLoad