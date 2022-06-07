import React, { useRef, useState, useEffect } from 'react'
import { max, mean,deviation } from 'd3-array'
import { select } from 'd3-selection'
import { nest } from 'd3-collection'
import { scaleLinear } from 'd3-scale'
import { axisTop, axisLeft, axisBottom } from 'd3-axis'
import { zoom, zoomIdentity, zoomTransform, invert } from 'd3-zoom'
import { pointer,event as currentevent } from 'd3'

import { saveAs } from 'file-saver';
import '../index.css'
import Loader from "react-loader-spinner";
import * as _ from "lodash";

const margin = { top: 20, right: 20, bottom: 50, left: 20 }
const width = 1500 - margin.left - margin.right
const height = 400 - margin.top - margin.bottom
const barDistance  = 100
const chrDistance = 5000000
const barWidth = 20
const xPosition = 80
const yPosition = 150


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
  '#FF2400', '#E56717', '#FDD017',
  '#5FFB17','#4EE2EC','#0041C2',
  '#E3319D','#9C67CA', '#452E5A']

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

function getSVGString( svgNode ) {
	svgNode.setAttribute('xlink', 'http://www.w3.org/1999/xlink');
	var serializer = new XMLSerializer();
	var svgString = serializer.serializeToString(svgNode);
	svgString = svgString.replace(/(\w+)?:?xlink=/g, 'xmlns:xlink='); // Fix root xlink without namespace
	svgString = svgString.replace(/NS\d+:href/g, 'xlink:href'); // Safari NS namespace fix

	return svgString;
}


function svgString2Image( svgString, width, height, format, callback ) {
	var format = format ? format : 'png';

	var imgsrc = 'data:image/svg+xml;base64,'+ btoa( unescape( encodeURIComponent( svgString ) ) ); // Convert SVG string to data URL

	var canvas = document.createElement("canvas");
	var context = canvas.getContext("2d");

	canvas.width = width;
	canvas.height = height;

	var image = new Image();
	image.onload = function() {
		context.clearRect ( 0, 0, width, height );
		context.drawImage(image, 0, 0, width, height);

		canvas.toBlob( function(blob) {
			var filesize = Math.round( blob.length/1024 ) + ' KB';
			if ( callback ) callback( blob, filesize );
		});


	};

	image.src = imgsrc;
}

function writeDownloadLink(svgString, filename){
    try {
        var isFileSaverSupported = !!new Blob();
    } catch (e) {
        alert("blob not supported");
    }
    var blob = new Blob([svgString], {type: "image/svg+xml"});
    saveAs(blob, filename);
};


function setGenome(ggdot,xScale,sampleSummary, genomeSummary,sampleData) {

  let svg_dot = select(ggdot.current)
  svg_dot.selectAll("*").remove()

  let sampleName = sampleData.key
  let sampleValues = sampleData.values

  // Add Y axis
  let y = scaleLinear().domain([0, 70000000]).range([ 0,height])
  let yAxis = axisLeft().scale(y).ticks(6).tickFormat(function(d,i) {  return d/1000000 })
  svg_dot.append("g")
      .attr("transform", `translate(50, 20)`)
      .style('font', '12px helvetica')
      .call(yAxis)

  sampleValues.forEach(function(d,i){

    let pointsA = d.values.map(function (d) {return [d.covA,d.pos]})
    let pointsB = d.values.map(function (d) {return [-1*d.covB,d.pos]})
    let mean = sampleSummary[sampleName].mean
    let chrPosX = xScale(genomeSummary[d.key].offset)+100

  //console.log(pointsB)
    let x = scaleLinear()
      .domain([-3*mean, 3*mean])
      .range([ -40, 40 ])

  svg_dot.append('g')
    .attr("transform", `translate(50, 20)`)
    .selectAll("dot")
    .data(pointsA)
    .enter().append("circle")
    .attr("cx", xi => chrPosX+x(xi[0]))
    .attr("cy", yi => y(yi[1]))
    .attr("r", 1.5)
    .style("fill", '#808080')

  svg_dot.append('g')
    .attr("transform", `translate(50, 20)`)
    .selectAll("dot")
    .data(pointsB)
    .enter().append("circle")
    .attr("cx", xi => chrPosX+x(xi[0]))
    .attr("cy", yi => y(yi[1]))
    .attr("r", 1.5)
    .style("fill", '#808080')

  svg_dot.append("line")
    .attr("transform", `translate(50, 20)`)
    .attr("x1", chrPosX)
    .attr("y1", y(0))
    .attr("x2", chrPosX)
    .attr("y2", y(genomeSummary[d.key].chrSize))
    .style("stroke", "black")
    .style("stroke-width", 2)

  svg_dot.append("line")
    .attr("transform", `translate(50, 20)`)
    .attr("x1", chrPosX+x(mean))
    .attr("y1", y(0))
    .attr("x2", chrPosX+x(mean))
    .attr("y2", y(genomeSummary[d.key].chrSize))
    .style("stroke", "#9933a2")
    .style("stroke-width", 2)

  svg_dot.append("line")
    .attr("transform", `translate(50, 20)`)
    .attr("x1", chrPosX-x(mean))
    .attr("y1", y(0))
    .attr("x2", chrPosX-x(mean))
    .attr("y2", y(genomeSummary[d.key].chrSize))
    .style("stroke", "#69b3a2")
    .style("stroke-width", 2)
  })
}

function drawHeatmap(svg, sampleName, sampleValues, sampleSummary, genomeSummary, xScale, chrPosY) {

  //const zooms = zoom()
  //  .scaleExtent([1, 40])
  //  .on("zoom", zoomed);
  //const zooms = zoom().on("zoom", function () {
  //     //heatMap.attr("transform", `translate(${80-5*chrPosX},0) scale(5,1)`)
  //     heatMap.attr("transform", `translate(80,0) scale(5,1)`)
  //  })

  let heatMap = svg.append('g')
  function zoomed({transform}) {
    heatMap.attr("transform", transform);
  }

  sampleValues.forEach(function(d,i){
    let datapoints = d.values.map(function (dp) {
      return [dp.pos,heColor(sampleSummary[sampleName].mean,sampleSummary[sampleName].sd,dp.covA,dp.covB)]
    })
  let chrPosX = xScale(genomeSummary[d.key].offset)


  /* draw frame */
  heatMap
    .append('g')
    .attr('transform', `translate(80,0)`)
    .append('rect')
    .attr('rx', 2)
    .attr('ry', 2)
    .attr('x', chrPosX)
    .attr('y', chrPosY)
    .attr('width', xScale(genomeSummary[d.key].chrSize))
    .attr('height', barWidth)
    .style('fill', '#FF2400AF')
    .style('fill-opacity',0.1)

  /* draw data points */
  var groups = heatMap.append('g');
  groups
    .attr('transform', `translate(80,0)`)
    .selectAll('line')
    .data(datapoints)
    .enter()
    .append('line')
    .attr("class",d.key)
    .style('stroke', d => d[1])
    .attr('chrGroup', d.key)
    .attr('value',d => d[0])
    .attr('x1', xi => chrPosX + xScale(xi[0]))
    .attr('y1', yi => chrPosY )
    .attr('x2', xi => chrPosX + xScale(xi[0]))
    .attr('y2', yi => chrPosY + barWidth)
  })
  //heatMap.on("click",() => {zooms()})
  //heatMap.call(zooms)
}

//possible solution
//    .call(zoom().on("zoom", function () {
//       svg.attr("transform", `translate(${80-5*chrPosX},0) scale(5,1)`)
//    }))




//function chrZoom(event, [x, y]) {
//    event.stopPropagation();
//    svg.transition().duration(750).call(
//      zoom.transform,
 //     zoomIdentity.translate(width / 2, height / 2).scale(10).translate(-x, -y),
//      pointer(event)
//    );
//  }

function drawChrLabels(chrLabels, genomeSummary, drawWidth) {
  let xScale = scaleLinear().domain([0, genomeSummary['map_size']]).range([0, drawWidth])
  let lastPos = 0
  let lastChrGroup = ""
  for (let chrGroup in genomeSummary) {
    if (genomeSummary[chrGroup].hasOwnProperty('offset')) {
      if(genomeSummary[chrGroup].offset > 0) {
        let labelPos = (genomeSummary[lastChrGroup].offset + genomeSummary[chrGroup].offset) / 2
        chrLabels
          .attr('transform', `translate(80,0)`)
          .append("text")
          .attr("class", "xLabel")
          .attr("x",xScale(labelPos))
          .attr("y",15)
          .attr("text-anchor", "middle")
          .text(lastChrGroup)
          .style('font', '16px helvetica')
          .style('font-weight','bold')
          .style('fill', 'rgb(0, 65, 194)')
        lastChrGroup = chrGroup
      }
      else {
        lastChrGroup=chrGroup
      }
    }
  }
  let labelPos = genomeSummary[lastChrGroup].offset + genomeSummary[lastChrGroup].chrSize / 2
  chrLabels
    .attr('transform', `translate(80,0)`)
    .append("text")
    .attr("class", "xLabel")
    .attr("x",xScale(labelPos))
    .attr("y",15)
    .attr("text-anchor", "middle")
    .text(lastChrGroup)
    .style('font', '16px helvetica')
    .style('font-weight','bold')
    .style('fill', 'rgb(0, 65, 194)')
}

/* function to chr axis in heatmap */
function drawChrAxis(heatmapAxis, genomeSummary, drawWidth) {
  let xScale = scaleLinear().domain([0, genomeSummary['map_size']]).range([0, drawWidth])
  heatmapAxis.attr('transform', `translate(80,0)`)

  for (let chrGroup in genomeSummary) {
    let chr = genomeSummary[chrGroup]
    if (chr.hasOwnProperty('offset')) {
      if(chr.offset >= 0) {
        let chrScale = scaleLinear()
            .domain([0, chr.chrSize])
            .range([xScale(chr.offset),xScale(chr.chrSize+chr.offset)])
        let chrAxis = heatmapAxis.append('g')
        chrAxis.call(axisBottom(chrScale).ticks(4).tickFormat(function(d,i) {  return d/1000000 }))
      }
    }
  }
}



const GenomeGroup = ({data}) => {
    const gglinear = useRef(null)
    const ggdot = useRef(null)
    const [dotplot, setDotPlot] = useState(null)
    const [, setSelectedSample] = useState(null)
    const [ggHeight, setGgHeight] = useState('400')

    useEffect(() => {

        if(data && gglinear.current) {

            const genomeSummary = getGenomeSummary(data)
            const sampleSummary = getSampleSummary(data)
            console.log(genomeSummary)
            console.log(sampleSummary)


            function handleSampleChange(sampleData,j) {
                let sample = sampleData.key
                // update sample label
                setDotPlot(sample)
                // update plot area
                setGenome(ggdot, xScale, sampleSummary, genomeSummary, sampleData)

                var sampleButtons = svg.selectAll(".sampleBtn")
                //unset old
                sampleButtons.style("fill","#525252")
                //set new selected
                sampleButtons.filter(function (d, i) { return i === j;})
                .style("fill","blue")
            }


            const xScale = scaleLinear().domain([0, genomeSummary['map_size']]).range([0, width-margin.right])
            const yScale = scaleLinear().domain([0, 300]).range([0, height])


            let svg = select(gglinear.current)
            svg.selectAll("*").remove()

            // append group translated to chart area
            svg = svg.append('g').attr('transform', `translate(${margin.left}, ${margin.top})`)

            //group by sample then by chr
            const heData = nest()
              .key(function(d) {return d.sample})
              .key(function(d) {return d.group})
              .entries(data)

            //set image height based on number of samples
            let num_samples = _.size(heData)
            setGgHeight(22 * (num_samples + 2))


            //let defaultX = xScale(genomeSummary[defaultData.key].offset)
            /* draw chr labels */
            let chrLabels = svg.append('g')
            drawChrLabels(chrLabels, genomeSummary, width-margin.right)

            /* draw chr axis */
            let heatmapAxis = svg.append('g')
            drawChrAxis(heatmapAxis, genomeSummary, width-margin.right)


            let heatMaps = svg.append('g')
            var zooms = zoom().scaleExtent([5, 5]).on("zoom",zoomed)
            var isZoomed = 0
            heatMaps.on("dblclick", function(event) {
                var curTransform = zoomTransform(heatMaps.node())
                var xPos = pointer(event)[0]
                var xPosZoomed = 5*xPos
                var lowerBound = -5*60
                var upperBound = -5*1200
                var transformation = ""
                if(isZoomed == 0) {
                if(xPos < 210 ) {   // left-boundary
                    transformation = lowerBound
                }
                else if(xPos > 1280 ) {   // right-boundary
                    transformation = upperBound
                }
                else { // otherwise
                    transformation = width / 2 - xPosZoomed
                }
                heatMaps.transition().duration(750).attr("transform","translate("+transformation+",0) scale(5,1)")
                /* remove existing label */
                chrLabels.remove()
                /* redraw label */
                chrLabels = svg.append('g')
                drawChrLabels(chrLabels, genomeSummary, 5*(width-margin.right))
                chrLabels.transition().duration(750).attr("transform","translate("+eval(transformation+400)+",0)")
                /* remove existing chr axis */
                heatmapAxis.remove()
                /* redraw axis */
                heatmapAxis = svg.append('g')
                drawChrAxis(heatmapAxis, genomeSummary, 5*(width-margin.right))
                heatmapAxis.transition().duration(750).attr("transform","translate("+eval(transformation+400)+",0)")
                isZoomed = 1
                }
                else {
                heatMaps.transition().duration(750).call(zooms.transform,zoomIdentity)
                /* redraw label */
                chrLabels.remove()
                chrLabels = svg.append('g')
                /* redraw label */
                drawChrLabels(chrLabels, genomeSummary, width-margin.right)
                /* remove existing chr axis */
                heatmapAxis.remove()
                heatmapAxis = svg.append('g')
                /* redraw axis */
                drawChrAxis(heatmapAxis, genomeSummary, width-margin.right)
                isZoomed = 0
                }
            })
            function zoomed({transform}) {
              heatMaps.attr("transform", transform);
            }

            heData.forEach(function(sampleData,j){
              let sampleName = sampleData.key
              let sampleValues = sampleData.values
              let chrPosY = yScale(`${margin.top+barWidth*j}`)

              // sample label
              svg
                .append('g')
                .append('rect')
                .attr("class","sampleBtn")
                .attr('rx', 4)
                .attr('ry', 4)
                .attr('x', xScale(0))
                .attr('y', chrPosY)
                .attr('width', 70)
                .attr('height', barWidth)

              svg
                .append("text")
                .attr("class", "y label")
                .attr("x",5)
                .attr("y",chrPosY+yScale(barWidth)-8)
                .text(sampleName)
                .style('font', '10px helvetica')
                .style('fill', 'white')
                .on("click", () => {
                    handleSampleChange(sampleData,j)
                })

              /* draw heatmap for sample */
              drawHeatmap(heatMaps, sampleName, sampleValues, sampleSummary, genomeSummary, xScale, chrPosY)
            })

            //set default sample
            handleSampleChange(heData[0],0)

            select('#saveHeatMap').on('click', function(){
	            var svgString = '<svg height="500" width="1000">'+getSVGString(svg.node())+'</svg>';
                writeDownloadLink(svgString, 'heatmap.svg')
	        })
            select('#saveScatter').on('click', function(){
                let svg_dot = select(ggdot.current)
	            var svgString = '<svg height="500" width="1000">'+getSVGString(svg_dot.node())+'</svg>';
                writeDownloadLink(svgString, 'scatterplot.svg')
	        })
        }
    },[data])

    return (
      <div>
        <div className = 'actionPanel'>
            <button className='saveBtn' id='saveHeatMap'>Export Heatmap</button>
            <button className='saveBtn' id='saveScatter'>Export ScatterPlot</button>
        </div>
        <div className='ggContainer'>
        <svg className='GGLinear'
            width = {width + margin.left + margin.right} 
            height= {ggHeight}
            ref={gglinear}></svg>
        </div>
        <h3>{dotplot}</h3>
        <div className='ggContainer'>
        <svg className='GGDot'
        width = {width + margin.left + margin.right} 
        height='400' ref={ggdot}></svg>
        </div>
      </div>
    )
}


export default GenomeGroup