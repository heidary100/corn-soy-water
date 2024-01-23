import React, { useRef, useEffect, useState } from 'react';
import * as d3 from 'd3';

function MultilineChart({ data = [], dimensions = {} }) {
  const svgRef = useRef(null);
  // const [prevItems, setPrevItems] = useState([]);
  const { margin = {} } = dimensions;
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const handleResize = () => {
      const containerWidth = svgRef.current.parentElement.clientWidth - margin.left - margin.right;
      setWidth(containerWidth > 0 ? containerWidth : 0);
    };

    handleResize(); // Initial call to set the initial width

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [margin.left, margin.right]);

  useEffect(() => {
    const lineData = data.filter((each) => each.type === 'line');
    const barData = data.filter((each) => each.type === 'bar');

    const svgEl = d3.select(svgRef.current);
    svgEl.selectAll('*').remove();

    // const containerWidth = svgRef.current.parentElement.clientWidth - margin.left - margin.right;
    // const width = containerWidth > 0 ? containerWidth : 0;
    const height = dimensions.height - margin.top - margin.bottom;

    const parseDate = d3.timeParse('%Y-%m-%d');

    const xScale = d3
      .scaleTime()
      .domain(d3.extent(data[0].items, (d) => parseDate(d.date)))
      .range([0, width]);

    const yScale = d3
      .scaleLinear()
      .domain([0, 12.5])
      .range([height, 0]);

    const y2Scale = d3
      .scaleLinear()
      .domain([0, 1.25])
      .range([height, 0]);

    const barYScale = d3
      .scaleLinear()
      .domain([0, 12.5])
      .range([height, 0]);

    const svg = svgEl.append('g').attr('transform', `translate(${margin.left},${margin.top})`);

    const xAxisTicks = width < 400 ? 4 : 12;

    const xAxis = d3.axisBottom(xScale)
      .ticks(xAxisTicks)
      .tickSize(-height)
      .tickFormat((date, i) => (i === 0 ? '' : d3.timeFormat('%m/%d')(date)));

    const xAxisGroup = svg
      .append('g')
      .attr('transform', `translate(0, ${height})`)
      .call(xAxis);

    xAxisGroup
      .selectAll('text')
      .attr('transform', 'rotate(-45)')
      .style('text-anchor', 'end')
      .attr('dx', '-.8em')
      .attr('dy', '.15em');

    // xAxisGroup.select('.domain').remove();
    xAxisGroup.selectAll('line').remove();
    xAxisGroup.selectAll('text').attr('font-size', '0.75rem');

    const yAxis = d3.axisLeft(yScale).ticks(5).tickSize(-width);

    const yAxisGroup = svg.append('g').call(yAxis);
    yAxisGroup.select('.domain').remove();
    yAxisGroup.selectAll('line').remove();
    yAxisGroup.selectAll('text').attr('font-size', '0.75rem');

    const yAxis2 = d3.axisRight(y2Scale).ticks(5).tickSize(width);
    const yAxis2Group = svg.append('g').call(yAxis2);
    yAxis2Group.select('.domain').remove();
    yAxis2Group.selectAll('line').remove();
    yAxis2Group.selectAll('text').attr('font-size', '0.75rem');

    const line = d3.line().x((d) => xScale(parseDate(d.date))).y((d) => yScale(d.value));

    svg
      .selectAll('.line')
      .data(lineData)
      .enter()
      .append('path')
      .attr('class', 'line')
      .attr('fill', 'none')
      .attr('stroke', (d) => d.color)
      .attr('stroke-width', 2)
      .attr('d', (d) => line(d.items))
      .attr('stroke-dasharray', (d) => (d.dashed ? 10 : 0))
      .transition()
      .duration(750)
      .ease(d3.easeLinear)
      .attr('stroke-dashoffset', 0);

    // Add bars
    for (let i = 0; i < barData.length; i += 1) {
      const barWidth = width / barData[i].items.length;

      svg
        .selectAll(`.bar${i}`)
        .data(barData[i].items)
        .enter()
        .append('rect')
        .attr('class', 'bar')
        // .attr('x', (d) => xScale(parseDate(d.items[0].date)) - barWidth / 2)
        .attr('x', (d) => xScale(parseDate(d.date)) - barWidth)
        .attr('y', (d) => barYScale(d.value))
        .attr('width', barWidth)
        .attr('height', (d) => height - barYScale(d.value))
        .attr('fill', barData[i].color);
    }
  }, [data, dimensions, width]);

  return <svg ref={svgRef} width="100%" height={dimensions.height} />;
}

export default MultilineChart;
