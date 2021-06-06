import React, { Component, useState, useEffect } from 'react'
import { max } from 'd3-array'
import { csv } from 'd3-fetch'



class GenomeGroup extends Component{
    constructor(props){
        super(props)
        this.createLG = this.createLG.bind(this)

    }

    componentDidMount() {
        this.createLG()
    }


    createLG() {
        const node = this.node
        const width = this.props.size[1]
        
        const genomeData = csv('/heviewer/data/bna.csv', d => ({
            distance: +d.cm,
            lgroup: d.lg,
            rb_chr: d.rb_chr.split(':')[0]
        }))

    }
    render() {
        return 
        <svg className='GGLinear' width = {this.props.size[0]} height={this.props.size[1]}>
            <g className='GG' ref={node => this.node = node}></g>
        </svg>
    }
}
export default GenomeGroup