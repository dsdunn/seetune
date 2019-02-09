import React, { Component } from "react";
import * as d3 from 'd3';
import { withRouter } from 'react-router-dom';
import logo from '../assets/loading.gif';

class TempoGraph extends Component {
  constructor(props){
    super(props);
    this.viz = React.createRef();
    this.state = {
      param: 'popularity'
    }
  }

  componentDidMount() {
    this.makeSvg();
    if(this.props.topTracks) {
      this.drawGraph(this.props.topTracks)
    }
  }

  makeSvg = () => {
    this.margin = {top: 45, right: 60, bottom: 150, left: 60};
    this.width = (window.innerWidth > 900 ? window.innerWidth * .95 : 850) - this.margin.left - this.margin.right;
    this.height = (window.innerHeight * .75) - this.margin.top - this.margin.bottom;

    this.svgContainer = d3.select(this.viz.current).append("svg")
         .attr("width", this.width + this.margin.right + this.margin.left)
         .attr("height", this.height + this.margin.top + this.margin.bottom)
      .append('g')
        .attr('transform', 
          'translate(' + this.margin.left + ',' + this.margin.top + ')');
  }

  componentDidUpdate(prevProps, prevState) {

    if (!this.props.topTracks) {
      return;
    }

    this.drawGraph(this.props.topTracks, this.state.param);          
  }

  sortTracks = (tracks, param = 'popularity') => {
    return tracks.sort((a,b) => {
      return a[param] - b[param];
    })
  }

  drawGraph = (topTracks = this.props.topTracks, param = this.state.param) => {

    let sortedTracks = this.sortTracks(topTracks, param);
    let height = this.height;
    let x = d3.scaleBand()
      .range([0, this.width])
      .padding(0.1);
    let y = d3.scaleLinear()
      .range([this.height, 0])
    let graph = this.svgContainer.selectAll('.bar')
      .data(sortedTracks, d => { return d.id; });
    let toolTip = d3.select('body').append('div')
      .attr('class', 'tool-tip')
      .style('background', 'white')
      .style('opacity', 1e-6)
    const t = d3.transition().duration(1000);
    const formatMinutes = d3.timeFormat('%M:%S')
    
    this.svgContainer.append('g')
      .attr('class', 'x axis')
      .attr('transform', 'translate(0,' + (this.height + 5) + ')')

    d3.select('.y-label')
      .remove()

    this.svgContainer.append('text')
      .attr('class', 'y-label')
      .attr('transform', 'rotate(-90)')
      .attr('y', -5 - this.margin.left)
      .attr('x', 0 - (height / 2))
      .attr('dy', '1em')
      .style('text-anchor', 'middle')
      .style('fill', 'white')
      .text(this.state.param === 'duration_ms' ? 'duration' : this.state.param )

    this.svgContainer.append('g')
      .attr('class', 'y axis');


    x.domain(sortedTracks.map(d => { return d.title } ));
    y.domain(this.setYDomain(sortedTracks, param));

    graph.enter()
        .append('rect')
        .attr('class', 'bar')
        .attr('y', this.height)
        .attr('x', function(d) { return x(d.title); })
        .attr('height', 0)
        .style('fill', 'steelblue')
        .attr('width', x.bandwidth())
      .merge(graph)
        .on('mouseover', function(d) {
          d3.select(this)
            .style('fill', '#7e2b39')

          toolTip.html(
            `<img src='${d.coverArt.url}'/>
            <table>
              <tr class='tip-title'>
                <td class='category'>title: </td>
                <td> ${d.title}</td>
              <tr>
              <tr class='tip-artist'>
                <td class='category'>artist: </td>
                <td> ${d.artistName}</td>
              </tr>
              <tr class='tip-tempo'>
                <td class='category'>tempo: </td>
                <td> ${Math.round(d.tempo)}</td>
              </tr>
              <tr class='tip-popularity'>
                <td class='category'>popularity: </td>
                <td> ${d.popularity}</td>
              </tr>
              <tr class='tip-dancability'>
                <td class='category'>danceability: </td>
                <td> ${d.danceability}</td>
              </tr>
              <tr class='tip-duration'>
                <td class='category'>duration: </td>
                <td> ${formatMinutes(d.duration_ms)}</td>
              </tr>
            </table>`
            )
            .classed('hide', false)
            .classed('show', true)
            .transition()
              .duration(300)
              .style('opacity', 0.9)
        })
        .on('mouseout', function(d) {
          d3.select(this)
            .style('fill', 'steelblue')
          toolTip
            .transition()
              .duration(300)
              .style('opacity', 1e-6)
              .on('end', () => {
                toolTip
                  .classed('hide', true)
                  .classed('show', false)
              })
        })
      .transition(t)
        .delay(function(d, i) {
          return i * 6;
        })
        .attr('height', function(d) { return height - y(d[param]); })
        .attr('y', function(d) { 
          return y(d[param]); })
        .transition(t)
        .delay(400)
        .attr('x', (d) => { return x(d.title); })

      graph.exit()
        .transition(t)
        .attr('opacity', 0)
        .remove()

    d3.select('.x').transition(t)
      .delay(1477) 
      .call(d3.axisBottom().scale(x).tickFormat((d) => {
        return this.titleSlice(d);
      }))

    d3.selectAll('.x text')
      .attr('transform', 'translate(-11,3) rotate(290)')
      .style('text-anchor', 'end');
      
    d3.select('.y').transition(t)
        .call(d3.axisLeft().scale(y).tickFormat((d) => {
          if (param === 'duration_ms') {
            return formatMinutes(d);
          } else { return d }
        }));
  }

  setYDomain = (tracks, param) => {
    switch(param) {
      case 'tempo':
        return [d3.min(tracks, function(d) { return d.tempo }) - 15 , d3.max(tracks, function(d) { return d.tempo}) + 15 ];
      case 'duration_ms':
        return [ 0, d3.max(tracks, function(d) { return d.duration_ms }) + 5000 ]
      case 'danceability':
        return [0, 1];
      default:
        return [-1, d3.max(tracks, function(d) { return d.popularity }) + 5 ];
    }
  }

  handleParamChange = (event) => {
    let param = event.target.value;

    this.setState({ param });
  }

  titleSlice = (str) => {
    if ( str.length > 25 ) {
      str = str.slice(0,22) + '...';
    }
    return str;
  }

  render(){

    return (
      <div className='TempoGraph'>
      <p className='instructions'>Hover over bars for track details.</p>
      <div className='graph-parameter'>
        <label htmlFor='param'>Y-Axis: </label>
        <select name='param' value={this.state.param} onChange={this.handleParamChange}>
          <option value='popularity' >Popularity</option>
          <option value='tempo'>Tempo (bpm)</option>
          <option value='duration_ms'>Duration (mm:ss)</option>
          <option value='danceability'>Danceabiltiy</option>   
        </select>
      </div>
      {
        this.props.loading &&
          <img className='loading' src={ logo } alt='loading gif'/>  
      }
      <div className='graph' ref={ this.viz }>
      </div>
    </div> 
    )
  }
}

export default withRouter(TempoGraph);
