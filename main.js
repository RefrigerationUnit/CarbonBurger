// main.js - Carbon Footprint Quiz

// ============ QUIZ DATA ============
const quizQuestions = [
    {
        question: "HOW OFTEN DO YOU EAT RED MEAT?",
        options: ["Daily", "Few times a week", "Rarely/Never"],
        values: [2.5, 1.5, 0.5] // metric tons CO2/year
    },
    {
        question: "WHAT IS YOUR MAIN MEDIUM OF TRANSPORTATION?",
        options: ["Car", "Bike", "Public Transportation", "Walking"],
        values: [4.6, 0.1, 1.2, 0.05]
    },
    {
        question: "WHAT DOES YOUR CAFFEINE CONSUMPTION LOOK LIKE?",
        options: ["Daily Starbucks", "Brew at home", "Energy drinks", "Don't drink"],
        values: [0.5, 0.15, 0.3, 0]
    },
    {
        question: "HOW OFTEN DO YOU TRAVEL BY AIRPLANE PER YEAR?",
        options: ["0 flights", "1 to 2 flights", "3 to 5 flights", "6+ flights"],
        values: [0, 1.5, 4, 8]
    },
    {
        question: "WHAT ARE YOUR STREAMING HABITS?",
        options: ["4+ daily hours", "Couple hours daily", "Weekends only", "Cable TV"],
        values: [0.4, 0.2, 0.08, 0.15]
    },
    {
        question: "HOW OFTEN DO YOU SHOP ONLINE?",
        options: ["Multiple times a week", "Weekly", "Monthly", "Rarely"],
        values: [1.2, 0.6, 0.2, 0.05]
    },
    {
        question: "WHICH STATE DO YOU LIVE IN?",
        type: "dropdown",
        options: [] // Will be populated with states
    }
];

// US States with CO2 multipliers (based on grid carbon intensity)
const usStates = [
    "Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", "Connecticut",
    "Delaware", "Florida", "Georgia", "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa",
    "Kansas", "Kentucky", "Louisiana", "Maine", "Maryland", "Massachusetts", "Michigan",
    "Minnesota", "Mississippi", "Missouri", "Montana", "Nebraska", "Nevada", "New Hampshire",
    "New Jersey", "New Mexico", "New York", "North Carolina", "North Dakota", "Ohio",
    "Oklahoma", "Oregon", "Pennsylvania", "Rhode Island", "South Carolina", "South Dakota",
    "Tennessee", "Texas", "Utah", "Vermont", "Virginia", "Washington", "West Virginia",
    "Wisconsin", "Wyoming"
];

// Celebrity data (6 celebrities)
const celebrityData = {
    "Jay Z": { co2: 4594, image: "JayZ.jpg", color: "#4a6fa5" },
    "Luke Bryan": { co2: 4007, image: "LukeBryan.jpg", color: "#e8a87c" },
    "Taylor Swift": { co2: 8294, image: "TaylorSwift.png", color: "#85c88a" },
    "Donald Trump": { co2: 32344, image: "DonaldTrump.jpg", color: "#9b72cf" },
    "Kim Kardashian": { co2: 4800, image: "KimKardashian.jpg", color: "#f4a259" },
    "P.Diddy": { co2: 6150, image: "PDiddy.jpg", color: "#bc6c8f" }
};

// CO2 per item (in kg)
const co2PerItem = {
    burgers: 6.61,        // kg CO2 per burger
    water: 0.0003,        // kg CO2 per glass
    nuggets: 0.15,        // kg CO2 per nugget
    cigarettes: 0.014,    // kg CO2 per cigarette
    uranium: 1e6          // kg CO2 equivalent per lb (nuclear is extremely energy dense)
};

// ============ QUIZ STATE ============
let currentQuestion = 0;
let selectedAnswer = null;
let totalCO2 = 0;
let quizCompleted = false;

// ============ DOM ELEMENTS ============
const questionEl = document.getElementById('quiz-question');
const optionsEl = document.getElementById('quiz-options');
const stateEl = document.getElementById('quiz-state');
const stateSelect = document.getElementById('state-select');
const nextBtn = document.getElementById('quiz-next-btn');
const resultsEl = document.getElementById('quiz-results');
const resultsValue = document.getElementById('results-value');
const restartBtn = document.getElementById('quiz-restart-btn');
const postQuizScroll = document.getElementById('post-quiz-scroll');
const quizBox = document.getElementById('quiz-box');

// ============ INITIALIZE QUIZ ============
function initQuiz() {
    // Populate state dropdown
    usStates.forEach(state => {
        const option = document.createElement('option');
        option.value = state;
        option.textContent = state;
        stateSelect.appendChild(option);
    });
    
    renderQuestion();
    
    nextBtn.addEventListener('click', handleNext);
    restartBtn.addEventListener('click', restartQuiz);
}

function renderQuestion() {
    const q = quizQuestions[currentQuestion];
    questionEl.textContent = q.question;
    optionsEl.innerHTML = '';
    selectedAnswer = null;
    
    if (q.type === 'dropdown') {
        optionsEl.style.display = 'none';
        stateEl.style.display = 'block';
    } else {
        optionsEl.style.display = 'flex';
        stateEl.style.display = 'none';
        
        q.options.forEach((opt, i) => {
            const btn = document.createElement('button');
            btn.className = 'quiz-option';
            btn.textContent = opt;
            btn.addEventListener('click', () => selectOption(btn, i));
            optionsEl.appendChild(btn);
        });
    }
}

function selectOption(btn, index) {
    document.querySelectorAll('.quiz-option').forEach(b => b.classList.remove('selected'));
    btn.classList.add('selected');
    selectedAnswer = index;
}

function handleNext() {
    const q = quizQuestions[currentQuestion];
    
    if (q.type === 'dropdown') {
        // State question - add base CO2 (average ~14 tons for US)
        totalCO2 += 5; // Base home energy (varies by state grid)
    } else {
        if (selectedAnswer === null) {
            alert('Please select an option!');
            return;
        }
        totalCO2 += q.values[selectedAnswer];
    }
    
    currentQuestion++;
    
    if (currentQuestion >= quizQuestions.length) {
        showResults();
    } else {
        renderQuestion();
    }
}

function showResults() {
    quizBox.style.display = 'none';
    resultsEl.style.display = 'block';
    resultsValue.textContent = totalCO2.toFixed(1) + ' metric tons/year';
    postQuizScroll.style.display = 'block';
    quizCompleted = true;
    
    // Draw the celebrity chart now that quiz is complete
    drawCelebrityChart();
}

function restartQuiz() {
    currentQuestion = 0;
    selectedAnswer = null;
    totalCO2 = 0;
    quizCompleted = false;
    
    quizBox.style.display = 'block';
    resultsEl.style.display = 'none';
    postQuizScroll.style.display = 'none';
    optionsEl.style.display = 'flex';
    stateEl.style.display = 'none';
    
    renderQuestion();
}

// ============ CELEBRITY BAR CHART ============
function drawCelebrityChart() {
    const container = d3.select('#celebrity-chart');
    container.selectAll('*').remove();
    
    const data = Object.entries(celebrityData).map(([name, info]) => ({
        name,
        co2: info.co2,
        color: info.color
    }));
    
    const margin = { top: 40, right: 30, bottom: 100, left: 80 };
    const width = Math.min(800, window.innerWidth - 60) - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;
    
    const svg = container.append('svg')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
        .append('g')
        .attr('transform', `translate(${margin.left},${margin.top})`);
    
    const x = d3.scaleBand()
        .domain(data.map(d => d.name))
        .range([0, width])
        .padding(0.3);
    
    const y = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.co2)])
        .nice()
        .range([height, 0]);
    
    // X axis
    svg.append('g')
        .attr('transform', `translate(0,${height})`)
        .call(d3.axisBottom(x))
        .selectAll('text')
        .attr('transform', 'rotate(-45)')
        .style('text-anchor', 'end')
        .style('font-size', '12px');
    
    // Y axis
    svg.append('g')
        .call(d3.axisLeft(y).tickFormat(d => d.toLocaleString()));
    
    // Y axis label
    svg.append('text')
        .attr('transform', 'rotate(-90)')
        .attr('y', -60)
        .attr('x', -height / 2)
        .attr('text-anchor', 'middle')
        .style('font-size', '12px')
        .text('CO₂ Emissions (metric tons)');
    
    // Bars with scroll animation
    const bars = svg.selectAll('.bar')
        .data(data)
        .enter()
        .append('rect')
        .attr('class', 'bar')
        .attr('x', d => x(d.name))
        .attr('width', x.bandwidth())
        .attr('y', height)
        .attr('height', 0)
        .attr('fill', d => d.color);
    
    // Animate bars on scroll
    const chartSection = document.getElementById('chart-section');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                bars.transition()
                    .duration(1000)
                    .delay((d, i) => i * 150)
                    .attr('y', d => y(d.co2))
                    .attr('height', d => height - y(d.co2));
            }
        });
    }, { threshold: 0.5 });
    
    observer.observe(chartSection);
}

// ============ CELEBRITY COMPARISON SLIDERS ============
const celebSelect = document.getElementById('celebrity-select');
const celebImage = document.getElementById('celebrity-image');
const celebBar = document.getElementById('single-celebrity-bar');
const celebValue = document.getElementById('celebrity-co2-value');
const yourBar = document.getElementById('your-co2-bar');
const yourValue = document.getElementById('your-co2-value');

const sliderBurgers = document.getElementById('slider-burgers');
const sliderWater = document.getElementById('slider-water');
const sliderNuggets = document.getElementById('slider-nuggets');
const sliderCigarettes = document.getElementById('slider-cigarettes');
const sliderUranium = document.getElementById('slider-uranium');

const valBurgers = document.getElementById('val-burgers');
const valWater = document.getElementById('val-water');
const valNuggets = document.getElementById('val-nuggets');
const valCigarettes = document.getElementById('val-cigarettes');
const valUranium = document.getElementById('val-uranium');

const finalCelebrity = document.getElementById('final-celebrity');
const finalBurgers = document.getElementById('final-burgers');
const finalWater = document.getElementById('final-water');
const finalNuggets = document.getElementById('final-nuggets');
const finalCigarettes = document.getElementById('final-cigarettes');
const finalUranium = document.getElementById('final-uranium');

function updateCelebrity() {
    const selected = celebSelect.value;
    const celeb = celebrityData[selected];
    
    // Update image
    celebImage.src = `0_images/celebrities/${celeb.image}`;
    celebImage.alt = selected;
    
    // Update bar (max is Trump at ~32000)
    const maxCO2 = 35000;
    const barWidth = (celeb.co2 / maxCO2) * 100;
    celebBar.style.width = barWidth + '%';
    celebBar.style.background = celeb.color;
    celebValue.textContent = celeb.co2.toLocaleString() + ' metric tons';
    
    // Update final message celebrity name
    finalCelebrity.textContent = selected + "'s";
    
    updateYourCO2();
}

function updateYourCO2() {
    const burgers = parseInt(sliderBurgers.value);
    const water = parseInt(sliderWater.value);
    const nuggets = parseInt(sliderNuggets.value);
    const cigarettes = parseInt(sliderCigarettes.value);
    const uranium = parseFloat(sliderUranium.value);
    
    // Update display values
    valBurgers.textContent = burgers.toLocaleString();
    valWater.textContent = water.toLocaleString();
    valNuggets.textContent = nuggets.toLocaleString();
    valCigarettes.textContent = cigarettes.toLocaleString();
    valUranium.textContent = uranium.toFixed(1);
    
    // Calculate total CO2 (convert kg to metric tons)
    const totalKg = 
        burgers * co2PerItem.burgers +
        water * co2PerItem.water +
        nuggets * co2PerItem.nuggets +
        cigarettes * co2PerItem.cigarettes +
        uranium * co2PerItem.uranium;
    
    const totalTons = totalKg / 1000;
    
    // Update bar
    const maxCO2 = 35000;
    const barWidth = Math.min((totalTons / maxCO2) * 100, 100);
    yourBar.style.width = barWidth + '%';
    yourValue.textContent = totalTons.toLocaleString(undefined, {maximumFractionDigits: 0}) + ' metric tons';
    
    // Update final message
    finalBurgers.textContent = burgers.toLocaleString();
    finalWater.textContent = water.toLocaleString();
    finalNuggets.textContent = nuggets.toLocaleString();
    finalCigarettes.textContent = cigarettes.toLocaleString();
    finalUranium.textContent = uranium.toFixed(1);
}

// Event listeners for sliders
celebSelect.addEventListener('change', updateCelebrity);
sliderBurgers.addEventListener('input', updateYourCO2);
sliderWater.addEventListener('input', updateYourCO2);
sliderNuggets.addEventListener('input', updateYourCO2);
sliderCigarettes.addEventListener('input', updateYourCO2);
sliderUranium.addEventListener('input', updateYourCO2);

// ============ INITIALIZE ============
document.addEventListener('DOMContentLoaded', () => {
    initQuiz();
    updateCelebrity();
});
