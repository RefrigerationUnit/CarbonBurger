var jsonData = d3.json("celebrity_jets.json")

let inputDataset, column, color; //Global variables for redraw on resize

function drawBarChart() {
  //Clear existing SVG
  d3.select("#chart").select("svg").remove()

  // Calculate dynamic square size (80% of the smaller viewport dimension)
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;
  const size = Math.min(viewportWidth, viewportHeight) * 0.8
  const width = size;
  const height = size;

  // Symmetric margins for centering
  const margin = { left: 180, right: 180, top: 180, bottom: 180 }
  const chartWidth = width - margin.left - margin.right;
  const chartHeight = height - margin.top - margin.bottom;

  const svg = d3.select("#chart")
    .append("svg")
    .attr("width", width)
    .attr("height", height)

  const xScale = d3.scaleBand()
    .domain(inputDataset.map(d => d.Name))
    .range([0, chartWidth])
    .padding(0.2)

  const yScale = d3.scaleLinear()
    .domain([0, d3.max(inputDataset, d => d[column])])
    .range([chartHeight, 0])
    .nice()

  // Tooltip
  var tooltip1 = d3.select("body").append("div")
      .attr("class", "tooltip1")
      .style("position", "absolute")
      .style("background", "#f9f9f9")
      .style("padding", "8px")
      .style("border-radius", "5px")
      .style("box-shadow", "0px 0px 6px rgba(0,0,0,0.1)")
      .style("visibility", "hidden")
      .style("font-family", "sans-serif")
      .style("font-size", "12px");

  // This creates a group element (g) for the chart, applying the specified margins
  const g = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`)

  // Draw bars (scaled to fit chartWidth)
  const barWidth = chartWidth / inputDataset.length;
  const gap = Math.max(2, barWidth * 0.1) // Dynamic gap, min 2px

  g.selectAll("rect")
    .data(inputDataset)
    .enter()
    .append("rect")
    .attr("x", d => xScale(d.Name))
    .attr("width", xScale.bandwidth())
    .attr("y", d => yScale(d[column]))
    .attr("height", d => chartHeight - yScale(d[column]))
    .attr("fill", color)
    .style("cursor", "pointer")
    .on("mouseover", function(e, d) {
      d3.select(this).attr("opacity", 0.7)
      tooltip1.html(
        `<strong>${d.Name}</strong><br>
        <strong>Total CO₂:</strong> ${d["Total CO2 Pollution (metric tons)"]}<br>
        <strong>Aircraft Model:</strong> ${d["Aircraft Model"]}<br>
        <strong>No. of Planes:</strong> ${d["No Of Planes"]}<br>
        <strong>Total Miles Flown:</strong> ${d["Total Miles Flown"]}<br>
        <strong>Total Flights:</strong> ${d["Total Flights"]}<br>
        <strong>Total Fuel Used:</strong> ${d["Total Fuel Used (gallons)"]} gallons<br>
        <strong>Total Flight Time:</strong> ${d["Total Flight Time (days)"]} days`)
        .style("visibility", "visible")
})
    .on("mousemove", function(e) {
        tooltip1.style("top", (e.pageY - 10) + "px")
              .style("left", (e.pageX + 10) + "px")
})
    .on("mouseout", function() {
        d3.select(this).attr("opacity", 1)
        tooltip1.style("visibility", "hidden")
});
      
  // y-axis
  g.append("g")
    .call(d3.axisLeft(yScale))
    .attr("font-size", 15)

  // y-axis label
 svg.append("text")
    .attr("transform", `rotate(-90)`)          
    .attr("x", - (margin.top + chartHeight / 2))  
    .attr("y", margin.left / 4)               
    .attr("text-anchor", "middle")
    .attr("font-weight", "bold")               
    .attr("font-size", 18)
    .text("Total CO2 Pollution (metric tons)"); 

  // x-Axis 
  g.append("g")
    .attr("transform", `translate(0, ${chartHeight})`)
    .call(d3.axisBottom(xScale))
    .selectAll("text")
    .attr("font-size", 15)
    .attr("text-anchor", "end")
    .attr("transform", "rotate(-45)")

    // x-axis label
  svg.append("text")
    .attr("x", margin.left + chartWidth / 2)   
    .attr("y", height - margin.bottom / 4)    
    .attr("text-anchor", "middle")
    .attr("font-weight", "bold")            
    .attr("font-size", 18)
    .text("Celebrity");             

  // Centered title
  svg.append("text")
    .text(`Bar chart of ${column}`)
    .attr("x", width / 2)
    .attr("y", margin.top / 2)
    .attr("font-family", "sans-serif")
    .attr("font-size", 25)
    .attr("text-anchor", "middle") // centers text horizontally
    .attr("font-weight", "bold")

  
}


// load + draw
  Promise.all([jsonData])
  .then(([celebrity_jets]) => {
    // Convert object to array to preserving names
    inputDataset = Object.entries(celebrity_jets).map(([name, values]) => ({
      Name: name,
      ...values
    }))

    column = "Total CO2 Pollution (metric tons)"
    color = "crimson"
    drawBarChart()

    // Redraw on resize
    window.addEventListener('resize', drawBarChart)
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
