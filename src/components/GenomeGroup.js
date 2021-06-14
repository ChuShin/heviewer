import React, { useRef, useState, useEffect } from 'react'
import { max } from 'd3-array'
import { select } from 'd3-selection'
import { nest } from 'd3-collection'
import { scaleLinear } from 'd3-scale'



const margin = { top: 80, right: 60, bottom: 80, left: 60 }
const width = 800 - margin.left - margin.right
const height = 600 - margin.top - margin.bottom
const barDistance  = 80
const barWidth = 25
const xScale = scaleLinear().domain([0, 5000]).range([0, width])
const yScale = scaleLinear().domain([0, 300]).range([0, height])



const color_pallete = ['#FF24009F', '#E567179F', '#FDD0179F', '#5FFB179F',
    '#4EE2EC9F', '#0041C29F', '#E3319D9F']

function setSelectedChr() {

}

function getGenomeSummary(data) {
    var i, offset = 0
    var genome_summary = {}
    for(i = 0; i < data.length; i++) {
      let g_size = max(data[i].values.map(function (d) { return d.end} ))
      genome_summary[data[i].key] = {
        name: data[i].key,
        order: i,
        num_markers: data[i].values.length,
        chr_size: g_size,
        offset: offset
      }
      offset += g_size
    }
    genome_summary['map_size'] = offset
    return genome_summary
  }
  

const GenomeGroup = ({data}) => {
    const gglinear = useRef(null)    
    useEffect(() => {
        if(data && gglinear.current) {
            var mydat = nest()
            .key(function(d) { return d.chr })
            .entries(data)
            var genome_summary = getGenomeSummary(mydat)
            console.log(genome_summary)
            let svg = select(gglinear.current)
            // append group translated to chart area
            svg = svg.append('g').attr('transform', `translate(${margin.left}, ${margin.top})`)

            mydat.forEach(function(d,i){
        
                /* draw frame */
                 svg
                   .append('g')
                   .append('rect')
                   .attr('rx', 2)
                   .attr('ry', 2)
                   .attr('x', xScale(genome_summary[d.key].offset+barDistance*i))
                   .attr('y', yScale(`${margin.top+20}`))
                   .attr('width', xScale(genome_summary[d.key].chr_size))
                   .attr('height', barWidth)
                   .style('fill', '#FF2400AF')
                   .on("click", () => {alert(d.key)});
              })

            svg
            .append('g')
            .attr('class', 'bar-header')
            .attr('transform', `translate(0, ${-margin.top / 2})`)
            .append('text')
            .append('tspan')
            .text('horizontal bars')
            
            svg.on("click", () => {
                console.log("click")

            })
        
        }
    },[data])


    return (
        <svg className='GGLinear' onClick={setSelectedChr}
            width = {width + margin.left + margin.right} 
            height= {height + margin.top + margin.bottom}
            ref={gglinear}
        ></svg>)
}

export default GenomeGroup