import React, { useRef, useState, useEffect } from 'react'
import { max, mean,deviation } from 'd3-array'
import { select } from 'd3-selection'
import { nest } from 'd3-collection'
import { scaleLinear } from 'd3-scale'
import { axisBottom, axisLeft } from 'd3-axis'



const margin = { top: 20, right: 20, bottom: 50, left: 20 }
const width = 1600 - margin.left - margin.right
const height = 400 - margin.top - margin.bottom
const barDistance  = 100
const chrDistance = 5000000
const barWidth = 20
const xPosition = 80
const yPosition = 150


function setSelectedChr() {
}

function getGenomeSummary(d) {
    // group data by chr
    let chrGroup = nest()
      .key(function(d) { return d.group })
      .entries(d)

    let i,offset = 0
    let genomeSummary = {}

    for(i = 0; i < chrGroup.length; i++) {
      let chrSize = max(chrGroup[i].values.map(function (d) { return d.pos} ))
      genomeSummary[chrGroup[i].key] = {
        name: chrGroup[i].key,
        chrSize: chrSize,
        offset: offset
      }
      offset += chrSize + chrDistance
    }
    genomeSummary['map_size'] = offset
    return genomeSummary
  }

function getSampleSummary(d) {
    // group data by chr
    let sampleGroup = nest()
      .key(function(d) { return d.sample })
      .entries(d)

    let i, offset = 0
    let sampleSummary = {}

    for(i = 0; i < sampleGroup.length; i++) {
      sampleSummary[sampleGroup[i].key] = {
        name: sampleGroup[i].key,
        mean: mean(sampleGroup[i].values.map(function (d) { return (d.covA + d.covB)} )) / 2,
        sd: deviation(sampleGroup[i].values.map(function (d) { return d.covA}))/2
      }
    }
    return sampleSummary
  }


function heColor(mean,sd,cov1,cov2) {
  const pallete = [
  '#FF24009F', '#E567179F', '#FDD0179F',
  '#5FFB179F','#4EE2EC9F', '#0041C29F', '#E3319D9F']
  //const pallete = [
  //  '#73D055FF','#B8DE29FF','#FDE725FF',
  //  '#39568CFF',null,'#238A8DFF',
  //  '#440154FF','#482677FF','#404788FF']

  let zscore1 = (cov1 - mean) / sd
  let zscore2 = (cov2 -mean) / sd
  /* del/del */
  if (zscore1<=-2 && zscore2<=-2) return pallete[0]
  /* del/norml */
  if (zscore1<-2 && (zscore2>-2 && zscore2<2)) return pallete[1]
  /* del/dup */
  if (zscore1<=-2 && zscore2>=2) return pallete[2]
  /* norml/del */
  if ((zscore1>-2 && zscore1<2) && zscore2<-2) return pallete[3]
  /* norml/norml */
  if ((zscore1>-2 && zscore1<2) && (zscore2>-2 && zscore2<2)) return pallete[4]
  /* norml/dup */
  if ((zscore1>-2 && zscore1<2) && zscore2>2) return pallete[5]
  /* del/dup */
  if (zscore1<=-2 && zscore2>=2) return pallete[6]
  /* del/norml */
  if (zscore1<-2 && (zscore2>-2 && zscore2<2)) return pallete[7]
  /* dup/dup */
  if (zscore1>2 && zscore2>2) return pallete[8]
}


function setGenome(ggdot,xScale,sampleSummary, genomeSummary,sampleData) {

  let svg_dot = select(ggdot.current)
  svg_dot.selectAll("*").remove()

  let sampleName = sampleData.key
  let sampleValues = sampleData.values

  sampleValues.forEach(function(d,i){

  let pointsA = d.values.map(function (d) {return [d.covA,d.pos]})
  let pointsB = d.values.map(function (d) {return [-1*d.covB,d.pos]})
  let mean = sampleSummary[sampleName].mean


  let chrPosX = xScale(genomeSummary[d.key].offset)+100

  //console.log(pointsB)
  let x = scaleLinear()
    .domain([-3*mean, 3*mean])
    .range([ -60, 60 ]);

  svg_dot.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(axisLeft(x));

  // Add Y axis
  let y = scaleLinear()
    .domain([0, 60000000])
    .range([ 0,height]);
  svg_dot.append("g")
  .call(axisLeft(y));


  svg_dot.append('g')
    .attr("transform", `translate(50,0)`)
    .selectAll("dot")
    .data(pointsA)
    .enter()
    .append("circle")
    .attr("cx", xi => chrPosX+x(xi[0]))
    .attr("cy", yi => y(yi[1]))
    .attr("r", 1.5)
    .style("fill", d => {
    if(d[0]>80) return '#69b3a2'
    if(d[0]<10) return '#9933a2'
    return '#808080'
    })

  svg_dot.append('g')
    .attr("transform", `translate(50,0)`)
    .selectAll("dot")
    .data(pointsB)
    .enter()
    .append("circle")
    .attr("cx", xi => chrPosX+x(xi[0]))
    .attr("cy", yi => y(yi[1]))
    .attr("r", 1.5)
    .style("fill", d => {
      if(d[0]<-80) return '#9933a2'
      if(d[0]>-10) return '#69b3a2'
      return '#808080'
    })

  svg_dot.append("line")
    .attr("transform", `translate(50,0)`)
    .attr("x1", chrPosX)
    .attr("y1", y(0))
    .attr("x2", chrPosX)
    .attr("y2", y(genomeSummary[d.key].chrSize))
    .style("stroke", "black")
    .style("stroke-width", 2)

  svg_dot.append("line")
    .attr("transform", `translate(50,0)`)
    .attr("x1", chrPosX+x(mean))
    .attr("y1", y(0))
    .attr("x2", chrPosX+x(mean))
    .attr("y2", y(genomeSummary[d.key].chrSize))
    .style("stroke", "#9933a2")
    .style("stroke-width", 2)

  svg_dot.append("line")
    .attr("transform", `translate(50,0)`)
    .attr("x1", chrPosX-x(mean))
    .attr("y1", y(0))
    .attr("x2", chrPosX-x(mean))
    .attr("y2", y(genomeSummary[d.key].chrSize))
    .style("stroke", "#69b3a2")
    .style("stroke-width", 2)



  })


}


const GenomeGroup = ({data}) => {
    const gglinear = useRef(null)
    const ggdot = useRef(null)
    useEffect(() => {
        if(data && gglinear.current) {

            let genomeSummary = getGenomeSummary(data)
            let sampleSummary = getSampleSummary(data)
            console.log(genomeSummary)
            console.log(sampleSummary)

            const xScale = scaleLinear().domain([0, genomeSummary['map_size']]).range([0, width-margin.right])
            const yScale = scaleLinear().domain([0, 300]).range([0, height])


            let svg = select(gglinear.current)
            // append group translated to chart area
            svg = svg.append('g').attr('transform', `translate(${margin.left}, ${margin.top})`)
            /* draw axis */
            let x_axis = axisBottom().scale(xScale).ticks(5);
            svg.append('g')
              .attr('transform', `translate(50, ${height - margin.bottom})`)
              .style('font', '16px helvetica')
              .call(x_axis)


            //group by sample then by chr
            let mydat = nest()
              .key(function(d) {return d.sample})
              .key(function(d) {return d.group})
              .entries(data)

              mydat.forEach(function(sampleData,j){
                let sampleName = sampleData.key
                let sampleValues = sampleData.values
                let chrPosY = yScale(`${margin.top+barWidth*j}`)

                // sample label
                svg
                  .append("text")
                  .attr("class", "y label")
                  .attr("x",xScale(0))
                  .attr("y",chrPosY+barWidth)
                  .text(sampleName)

                sampleValues.forEach(function(d,i){
                  let datapoints = d.values.map(function (dp) {
                    return [dp.pos,heColor(sampleSummary[sampleName].mean,sampleSummary[sampleName].sd,dp.covA,dp.covB)]
                  })
                  let chrPosX = xScale(genomeSummary[d.key].offset)

                  /* draw frame */
                  svg
                   .append('g')
                   .attr('transform', `translate(50,0)`)
                   .append('rect')
                   .attr('rx', 2)
                   .attr('ry', 2)
                   .attr('x', chrPosX)
                   .attr('y', chrPosY)
                   .attr('width', xScale(genomeSummary[d.key].chrSize))
                   .attr('height', barWidth)
                   .style('fill', '#FF2400AF')
                   .style('fill-opacity',0.1)
                   .on("click", () => {setGenome(ggdot,xScale,sampleSummary,genomeSummary,sampleData)});

                  /* draw data points */
                  svg
                  .append('g')
                   .attr('transform', `translate(50,0)`)
                  .selectAll('line')
                  .data(datapoints)
                  .enter()
                  .append('line')
                  .style('stroke', d => d[1])
                  .attr('chrGroup', d.key)
                  .attr('value',d => d[0])
                  .attr('x1', xi => chrPosX + xScale(xi[0]))
                  .attr('y1', yi => chrPosY )
                  .attr('x2', xi => chrPosX + xScale(xi[0]))
                  .attr('y2', yi => chrPosY + barWidth)
                  .attr('stroke-width', 1)
                })
            })

            svg
            .append('g')
            .attr('class', 'bar-header')
            .attr('transform', `translate(0, ${margin.top})`)
            .append('text')
            .append('tspan')
            .text('HE')        
        }
    },[data])


    return (
      <div>
        <svg className='GGLinear' onClick={setSelectedChr}
            width = {width + margin.left + margin.right} 
            height= {height + margin.top + margin.bottom}
            ref={gglinear}></svg>        
        
        <svg className='GGDot' onClick={setSelectedChr}
        width = {width + margin.left + margin.right} 
        height= {height + margin.top + margin.bottom}
        ref={ggdot}></svg>
      </div>
    )
}

export default GenomeGroup