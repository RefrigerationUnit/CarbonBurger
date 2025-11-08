var jsonData = d3.json("anscombe.json");

let inputDataset, column, color; //Global variables for redraw on resize

function drawBarChart() {
  //Clear existing SVG
  d3.select("#chart").select("svg").remove();

  // Calculate dynamic square size (80% of the smaller viewport dimension)
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;
  const size = Math.min(viewportWidth, viewportHeight) * 0.8;
  const width = size;
  const height = size;

  // Symmetric margins for centering
  const margin = { left: 50, right: 50, top: 50, bottom: 50 };
  const chartWidth = width - margin.left - margin.right;
  const chartHeight = height - margin.top - margin.bottom;

  const svg = d3.select("#chart")
    .append("svg")
    .attr("width", width)
    .attr("height", height);

  const hScale = d3.scaleLinear().domain([0, 20]).range([0, chartHeight]);
  const yAxisScale = d3.scaleLinear().domain([0,20]).range([chartHeight,0]);

  // This creates a group element (g) for the chart, applying the specified margins
  const g = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

  // Draw bars (scaled to fit chartWidth)
  const barWidth = chartWidth / inputDataset.length;
  const gap = Math.max(2, barWidth * 0.1); // Dynamic gap, min 2px
  const bars = g.selectAll("rect")
    .data(inputDataset)
    .enter()
    .append("rect")
      .attr("x", (d,i) => i * barWidth + gap / 2) // Offset for centering bars within their slots
      .attr("width", barWidth - gap)
      .attr("height", d => hScale(d[column]))
      .attr("y", d => chartHeight - hScale(d[column]))
      .attr("fill", color);
      
  // y-axis
  g.append("g").call(d3.axisLeft(yAxisScale));

  // Centered title
  svg.append("text")
    .text(`Bar chart of ${column}`)
    .attr("x", width / 2)
    .attr("y", margin.top / 2)
    .attr("font-family", "sans-serif")
    .attr("font-size", 12)
    .attr("text-anchor", "middle") // centers text horizontally
}

// load + draw
Promise.all([jsonData])
  .then(([anscombe]) => {
    console.log('loaded', anscombe); // verify JSON loaded
    inputDataset = anscombe.set1;
    column = "x";
    color = "crimson";
    drawBarChart();

    // Redraw on resize
    window.addEventListener('resize', drawBarChart);
  });

  // Populate dropdown with states from external JSON
  d3.json("states.json").then(function(states) {
    d3.select("#state-select")
      .selectAll("option")
      .data(states)
      .enter()
      .append("option")
      .text(function(d) {return d; });
  })
