import React, { useRef, useEffect, useState } from 'react';
import * as d3 from 'd3';

function MultilineChart({ data = [], dimensions = {} }) {
  const svgRef = useRef(null);
  const [prevItems, setPrevItems] = useState([]);
  const { width, height, margin = {} } = dimensions;
  const svgWidth = width + margin.left + margin.right;
  const svgHeight = height + margin.top + margin.bottom;

  useEffect(() => {
    const xScale = d3
      .scaleTime()
      .domain(d3.extent(data[0].items, (d) => d.date))
      .range([0, width]);

    const yScale = d3
      .scaleLinear()
      .domain([
        0,
        12.5,
      ])
      .range([height, 0]);

    const y2Scale = d3
      .scaleLinear()
      .domain([0,
        1.25,
      ])
      .range([height, 0]);

    const svgEl = d3.select(svgRef.current);
    svgEl.selectAll('*').remove();
    const svg = svgEl.append('g').attr('transform', `translate(${margin.left},${margin.top})`);

    const xAxis = d3
      .axisBottom(xScale)
      .ticks(5)
      .tickSize(-height);

    const xAxisGroup = svg
      .append('g')
      .attr('transform', `translate(0, ${height + 10})`)
      .call(xAxis);

    xAxisGroup.select('.domain').remove();
    xAxisGroup.selectAll('line').attr('stroke', 'rgba(0, 0, 0, 0.2)');
    xAxisGroup.selectAll('text').attr('opacity', 0.5).attr('color', 'black').attr('font-size', '0.75rem');

    const yAxis = d3
      .axisLeft(yScale)
      .ticks(5)
      .tickSize(-width);

    const yAxisGroup = svg.append('g').call(yAxis);
    yAxisGroup.select('.domain').remove();
    yAxisGroup.selectAll('line').attr('stroke', 'rgba(0, 0, 0, 0.2)');
    yAxisGroup.selectAll('text').attr('opacity', 0.5).attr('color', 'black').attr('font-size', '0.75rem');

    const yAxis2 = d3.axisRight(y2Scale).ticks(5).tickSize(width);
    const yAxis2Group = svg.append('g').call(yAxis2);
    yAxis2Group.select('.domain').remove();
    yAxis2Group.selectAll('text').attr('opacity', 0.5).attr('color', 'black').attr('font-size', '0.75rem');

    const line = d3.line().x((d) => xScale(d.date)).y((d) => yScale(d.value));

    const lines = svg
      .selectAll('.line')
      .data(data)
      .enter()
      .append('path')
      .attr('fill', 'none')
      .attr('stroke', (d) => d.color)
      .attr('stroke-width', 3)
      .attr('d', (d) => line(d.items));

    lines.each((d, i, nodes) => {
      const element = nodes[i];
      const length = element.getTotalLength();
      if (!prevItems.includes(d.name)) {
        d3.select(element)
          .attr('stroke-dasharray', `${length},${length}`)
          .attr('stroke-dashoffset', length)
          .transition()
          .duration(750)
          .ease(d3.easeLinear)
          .attr('stroke-dashoffset', 0);
      }
    });
    setPrevItems(data.map(({ name }) => name));
  }, [data]);

  return <svg ref={svgRef} width={svgWidth} height={svgHeight} />;
}

export default MultilineChart;
