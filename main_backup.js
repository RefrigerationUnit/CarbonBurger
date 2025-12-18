var jsonData = d3.json("celebrity_jets.json")

let inputDataset, column, color; //Global variables for redraw on resize

function drawBarChart(chartID) {
  //Clear existing SVG
  d3.select(chartID).select("svg").remove()

  // Calculate dynamic square size (80% of the smaller viewport dimension)
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;
  const size = Math.min(viewportWidth, viewportHeight) *0.9
  const width = size;
  const height = size;

  // Symmetric margins for centering
  const margin = { left: 200, right: 200, top: 200, bottom: 200 }
  const chartWidth = width - margin.left - margin.right;
  const chartHeight = height - margin.top - margin.bottom;

  const svg = d3.select(chartID)
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

  
  var tooltip1 = d3.select("body").append("div")
    .attr("class", "tooltip1")
    .style("position", "absolute")
    .style("background", "#ffffff")
    .style("padding", "8px 12px")    
    .style("border-radius", "10px")
    .style("box-shadow", "0px 4px 15px rgba(0,0,0,0.2)")
    .style("visibility", "hidden")
    .style("font-family", "sans-serif")
    .style("font-size", "25px")        
    .style("line-height", "1.6")    
    .style("max-width", "420px")      
    .style("white-space", "normal"); 

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
        tooltip1.style("top", (e.pageY - 50) + "px")
              .style("left", (e.pageX + 10) + "px")
})
    .on("mouseout", function() {
        d3.select(this).attr("opacity", 1)
        tooltip1.style("visibility", "hidden")
});

 // Find the tiny bar (13.8 metric tons)
  g.selectAll("rect")
  const tinyBar = inputDataset.find(d => d.Name === "Your Emissions");

  if (tinyBar) {
      const xPos = xScale(tinyBar.Name) + xScale.bandwidth() / 2;
      const yPos = yScale(tinyBar[column]);

      const arrowLength = 300;

      // Draw the arrow line
      g.append("line")
        .attr("x1", xPos)
        .attr("y1", yPos - arrowLength)
        .attr("x2", xPos)
        .attr("y2", yPos -10)
        .attr("stroke", "black")
        .attr("stroke-width", 3)
        .attr("opacity", 0)
        .transition()
        .duration(800)
        .attr("opacity", 1);

      g.append("polygon")
        .attr("points", `
            ${xPos - 8},${yPos - 25}
            ${xPos + 8},${yPos - 25}
            ${xPos},${yPos - 8}
        `)
        .attr("fill", "black")
        .attr("opacity", 0)
        .transition()
        .duration(800)
        .delay(200)
        .attr("opacity", 1);

      // Add label text
      g.append("text")
          .attr("x", xPos)
          .attr("y", yPos - arrowLength - 10)
          .attr("text-anchor", "middle")
          .attr("fill", "black")
          .attr("font-size", 25)
          .attr("opacity", 0)
          .text("13.8 metric tons of CO2 Emissions")
          .transition()
          .duration(1000)
          .delay(300)
          .attr("opacity", 1)
          .attr("y", yPos - 350); // slight slide-in
  }
  // y-axis
  g.append("g")
    .call(d3.axisLeft(yScale))
    .attr("font-size", 22)

  // y-axis label
 svg.append("text")
    .attr("transform", `rotate(-90)`)          
    .attr("x", - (margin.top + chartHeight / 2))  
    .attr("y", margin.left / 4)               
    .attr("text-anchor", "middle")
    .attr("font-weight", "bold")               
    .attr("font-size", 30)
    .text("Total CO2 Pollution (metric tons)"); 

  // x-Axis 
  g.append("g")
    .attr("transform", `translate(0, ${chartHeight})`)
    .call(d3.axisBottom(xScale))
    .selectAll("text")
    .attr("font-size", 22)
    .attr("text-anchor", "end")
    .attr("transform", "rotate(-45)")

    // y-axis 
  svg.append("text")
    .attr("x", margin.left + chartWidth / 2)   
    .attr("y", height - margin.bottom / 10)    
    .attr("text-anchor", "middle")
    .attr("font-weight", "bold")            
    .attr("font-size", 30)
    .text("Celebrity");             

  // Centered title
  svg.append("text")
    .text(`Bar chart of ${column}`)
    .attr("x", width / 2)
    .attr("y", margin.top / 2)
    .attr("font-family", "sans-serif")
    .attr("font-size", 45)
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
    drawBarChart("#chart")

    // Adding avg C02 emissions 
    inputDataset.push({
      Name: "Your Emissions",
      "Total CO2 Pollution (metric tons)": 13.8,
      /*customTooltip: "Your personal yearly emissions estimate is 13.8 metric tons."*/
    });

    column = "Total CO2 Pollution (metric tons)";
    color = "crimson";
    drawBarChart("#chart1")

    // Redraw on resize
    window.addEventListener('resize', drawBarChart)
  })

  // Populate dropdown with states from external JSON
 let stateData = {};

    d3.json("states.json").then(function(states) {

        // Populate dropdown
        d3.select("#state-select")
          .selectAll("option")
          .data(states)
          .enter()
          .append("option")
          .attr("value", d => d.state)
          .text(d => d.state);

        // Store emissions in lookup table
        states.forEach(d => {
            stateData[d.state] = d.emissions;
        });

    });



// Single panel quiz
const quizSteps = [
  {
    id: "meat",
    type: "buttons",
    question: "How often do you eat red meat?",
    options: [
      { label: "Daily", value: 1.2 },
      { label: "Few times a week", value: 0.6 },
      { label: "Rarely/never", value: 0.15 }
    ]
  },

  {
    id: "transport",
    type: "buttons",
    question: "What is your main medium of transportation?",
    options: [
      { label: "Car", value: 5.5 },
      { label: "Bike", value: 0.0 },
      { label: "Public Transport", value: 0.5 },
      { label: "Walking", value: 0.0 }
    ]
  },

  {
    id: "caffeine",
    type: "buttons",
    question: "How much caffeine do you drink?",
    options: [
      { label: "Daily Starbucks", value: 0.15 },
      { label: "Brew at home", value: 0.05 },
      { label: "Energy drinks", value: 0.12 },
      { label: "Don't drink", value: 0.0 }
    ]
  },

  {
    id: "travel",
    type: "buttons",
    question: "How often do you travel by air per year?",
    options: [
      { label: "0 flights", value: 0 },
      { label: "1–2 flights", value: 0.8 },
      { label: "3–5 flights", value: 2.0 },
      { label: "6+ flights", value: 4.0 }
    ]
  },

  {
    id: "streaming",
    type: "buttons",
    question: "What are your streaming habits?",
    options: [
      { label: "4+ hours daily", value: 0.2 },
      { label: "Couple hours daily", value: 0.1 },
      { label: "Weekends only", value: 0.04 },
      { label: "Cable TV", value: 0.15 }
    ]
  },

  {
    id: "shopping",
    type: "buttons",
    question: "How often do you shop online?",
    options: [
      { label: "Multiple times/week", value: 0.8 },
      { label: "Weekly", value: 0.4 },
      { label: "Monthly", value: 0.15 },
      { label: "Rarely", value: 0.05 }
    ]
  },

  {
    id: "state",
    type: "state",
    question: "Which state do you live in?"
  },

  {
    id: "results",
    type: "results",
    question: "Your results are in!"
  }
];

const quizState = {
  currentIndex: 0,
  answers: {}
};


const quizBox      = document.getElementById("quiz-box");
const quizQuestion = document.getElementById("quiz-question");
const quizOptions  = document.getElementById("quiz-options");
const quizStateDiv = document.getElementById("quiz-state");
const quizNextBtn  = document.getElementById("quiz-next-btn");
const quizResults  = document.getElementById("quiz-results");
const stateSelect  = document.getElementById("state-select");
const quizRestartBtn = document.getElementById("quiz-restart-btn");



function renderQuizStep() {
  const step = quizSteps[quizState.currentIndex];

  // reset UI
  quizOptions.innerHTML = "";
  quizStateDiv.style.display = "none";
  quizResults.style.display = "none";
  quizRestartBtn.style.display = "none";
  quizNextBtn.style.display = "inline-block";

  // set question title
  if (step.type !== "results") {
    quizQuestion.textContent = step.question;
  }

  // button
  if (step.type === "buttons") {
    step.options.forEach(opt => {
      const btn = document.createElement("button");
      btn.className = "btn1";
      btn.textContent = opt.label;
      btn.dataset.value = opt.value;

      btn.addEventListener("click", () => {
        quizState.answers[step.id] = opt.value;
        quizOptions.querySelectorAll("button").forEach(b => b.classList.remove("selected"));
        btn.classList.add("selected");
      });

      quizOptions.appendChild(btn);
    });
  }

  // state dropdown
  else if (step.type === "state") {
    quizStateDiv.style.display = "block";
  }

  // final results
  else if (step.type === "results") {
    quizQuestion.textContent = "Your results are in!";

    const meat       = Number(quizState.answers.meat || 0);
    const transport  = Number(quizState.answers.transport || 0);
    const caffeine   = Number(quizState.answers.caffeine || 0);
    const travel     = Number(quizState.answers.travel || 0);
    const streaming  = Number(quizState.answers.streaming || 0);
    const shopping   = Number(quizState.answers.shopping || 0);

    const userState  = quizState.answers.state;
    const stateEmission = stateData[userState] || 0;

    const total =
      meat +
      transport +
      caffeine +
      travel +
      streaming +
      shopping;

    // store for comparison chart panel
    quizState.answers.total = total;
    quizState.answers.stateEmission = stateEmission;

    quizNextBtn.style.display = "none";
    quizResults.style.display = "block";

    quizResults.textContent = `Your estimated CO₂ emissions are about ${total.toFixed(2)} metric tons/year`;

    quizRestartBtn.style.display = "inline-block";
  }
}


// restarting quiz
function restartQuiz() {
  quizState.currentIndex = 0;
  quizState.answers = {};

  quizResults.style.display = "none";
  quizRestartBtn.style.display = "none";
  quizOptions.innerHTML = "";
  quizStateDiv.style.display = "none";

  renderQuizStep();
}

quizRestartBtn.addEventListener("click", restartQuiz);


// next button
quizNextBtn.addEventListener("click", () => {
  const step = quizSteps[quizState.currentIndex];

  if (step.type === "buttons" && quizState.answers[step.id] == null) {
    alert("Please select an option before continuing.");
    return;
  }

  if (step.type === "state") {
    quizState.answers.state = stateSelect.value || null;
  }

  quizState.currentIndex++;
  renderQuizStep();
});


// start quiz
if (quizBox && quizQuestion && quizNextBtn) {
  renderQuizStep();
}


// another chart for the question results
function drawStateComparisonChart() {

    console.log("State Compare Triggered:", quizState.answers);

    const userTotal  = Number(quizState.answers.total || 0);
    const stateValue = Number(quizState.answers.stateEmission || 0);
    const stateName  = quizState.answers.state || "Your State";

    // If no state selected, do NOT draw
    if (!quizState.answers.state) {
        console.warn("No state selected, skipping chart.");
        return;
    }

    const data = [
        { name: "You", value: userTotal },
        { name: stateName, value: stateValue }
    ];

    // Completely clear old chart
    d3.select("#state-compare-chart").selectAll("*").remove();

    // Chart dimensions
    const width = 2500;
    const height = 1700;
    const margin = { top: 500, right: 50, bottom: 100, left: 200 };

    const chartWidth = width - margin.left - margin.right;
    const chartHeight = height - margin.top - margin.bottom;

    const svg = d3.select("#state-compare-chart")
        .append("svg")
        .attr("width", width)
        .attr("height", height);

    const g = svg.append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top})`);

    // X scale
    const maxValue = d3.max(data, d => d.value) || 1;  // prevent zero max

    const x = d3.scaleLinear()
        .domain([0, maxValue])
        .range([0, chartWidth])
        .nice();

    // Y scale
    const y = d3.scaleBand()
        .domain(data.map(d => d.name))
        .range([0, chartHeight])
        .padding(0.3);

    // Bars
    g.selectAll("rect")
        .data(data)
        .enter()
        .append("rect")
        .attr("y", d => y(d.name))
        .attr("x", 0)
        .attr("width", d => x(d.value))
        .attr("height", y.bandwidth())
        .attr("fill", "crimson");

    // Y Axis
    const yAxis = g.append("g")
        .call(d3.axisLeft(y));

    yAxis.selectAll("text")
        .style("font-size", "28px")
        .style("font-weight", "bold");

    // X Axis
    const xAxis = g.append("g")
        .attr("transform", `translate(0, ${chartHeight})`)
        .call(d3.axisBottom(x));

    xAxis.selectAll("text")
        .style("font-size", "24px")
        .style("font-weight", "bold");

    // X-axis label
    svg.append("text")
        .attr("x", margin.left + chartWidth / 2)
        .attr("y", height - 30)
        .attr("text-anchor", "middle")
        .attr("font-size", "28px")
        .attr("font-weight", "bold")
        .text("CO₂ Emissions (metric tons)");
}


// trigger comparison chart when user scrolls down
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            console.log("Chart panel in view, drawing chart...");
            drawStateComparisonChart();
        }
    });
}, { threshold: 0.05 });

const chartPanel = document.querySelector("#state-compare-chart");

if (chartPanel) observer.observe(chartPanel);
else console.warn("⚠ #state-compare-chart not found!");




/* OLD VER: store user selections for the questions
const selections = {};

// handle all buttons with data-value
document.querySelectorAll('.btn1[data-value]').forEach(btn => {
  btn.addEventListener('click', e => {
    const panel = e.target.closest('.panel');
    const step = panel.dataset.step;
    const value = parseFloat(e.target.dataset.value);

    // store selection for this question
    selections[step] = value;

    // Optional: highlight selected button
    panel.querySelectorAll('.btn1').forEach(b => b.classList.remove('selected'));
    e.target.classList.add('selected');
  });
});

// Scroll-triggered logic: detect last panel and show results
function showQuizResults() {
  const total = Object.values(selections).reduce((a,b) => a + b, 0);
  document.getElementById('quiz-results').textContent = 
      `Your total CO₂ emissions: ${total.toFixed(2)} tons/year`;
}

// Call this function when user reaches results panel
// If using scrollytelling.js, you can trigger this in your step enter callback
document.querySelectorAll('.panel[data-step="results"]').forEach(panel => {
  panel.addEventListener('mouseenter', showQuizResults);
});
*/
