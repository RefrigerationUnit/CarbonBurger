var jsonData = d3.json("anscombe.json");

function barChart(inputDataset, column = "x", color = "steelblue") {
  const width = 400, height = 400;
  const chartHeight = 300;
  const margin = { left: 30, top: 30 };
  const barWidth = 20, gap = 2;

  const svg = d3.select("#chart")
    .append("svg")
    .attr("width", width)
    .attr("height", height);

  const hScale = d3.scaleLinear().domain([0, 20]).range([0, chartHeight]);
  const yAxisScale = d3.scaleLinear().domain([0, 20]).range([chartHeight, 0]);

  const g = svg.append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  // draw bars
  const bars = g.selectAll("rect")
    .data(inputDataset)
    .enter()
    .append("rect")
      .attr("x", (d,i) => i * barWidth)
      .attr("width", barWidth - gap)
      .attr("height", d => hScale(d[column]))
      .attr("y", d => chartHeight - hScale(d[column]))
      .attr("fill", color);

  // y-axis
  g.append("g").call(d3.axisLeft(yAxisScale));

  // small title
  svg.append("text")
    .text(`Bar chart of ${column}`)
    .attr("x", 10)
    .attr("y", 16)
    .attr("font-family", "sans-serif")
    .attr("font-size", 12);
}

// load + draw
Promise.all([jsonData])
  .then(([anscombe]) => {
    console.log('loaded', anscombe); // verify JSON loaded
    barChart(anscombe.set1, "x", "crimson");
  })

  // Populate dropdown with states from external JSON
  d3.json("states.json").then(function(states) {
    d3.select("#state-select")
      .selectAll("option")
      .data(states)
      .enter()
      .append("option")
      .text(function(d) {return d; });
  })
