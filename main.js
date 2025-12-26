// ============ QUIZ DATA ============
const quizQuestions = [
    {
        question: "HOW OFTEN DO YOU EAT RED MEAT?",
        options: ["DAILY", "FEW TIMES A WEEK", "RARELY/NEVER"],
        values: [2.5, 1.5, 0.5]
    },
    {
        question: "WHAT IS YOUR MAIN MEDIUM OF TRANSPORTATION?",
        options: ["CAR", "BIKE", "PUBLIC TRANSPORTATION", "WALKING"],
        values: [4.6, 0.1, 1.2, 0.05]
    },
    {
        question: "WHAT DOES YOUR CAFFEINE CONSUMPTION LOOK LIKE?",
        options: ["DAILY STARBUCKS", "BREW AT HOME", "ENERGY DRINKS", "DON'T DRINK"],
        values: [0.5, 0.15, 0.3, 0]
    },
    {
        question: "HOW OFTEN DO YOU TRAVEL BY AIRPLANE PER YEAR?",
        options: ["0 FLIGHTS", "1 TO 2 FLIGHTS", "3 TO 5 FLIGHTS", "6+ FLIGHTS"],
        values: [0, 1.5, 4, 8]
    },
    {
        question: "WHAT ARE YOUR STREAMING HABITS?",
        options: ["4+ DAILY HOURS", "COUPLE HOURS DAILY", "WEEKENDS ONLY", "CABLE TV"],
        values: [0.4, 0.2, 0.08, 0.15]
    },
    {
        question: "HOW OFTEN DO YOU SHOP ONLINE?",
        options: ["MULTIPLE TIMES A WEEK", "WEEKLY", "MONTHLY", "RARELY"],
        values: [1.2, 0.6, 0.2, 0.05]
    },
    {
        question: "WHICH STATE DO YOU LIVE IN?",
        type: "dropdown"
    }
];

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

// Celebrity data (matching the 6 in the image)
const celebrityData = {
    "Jay Z": { co2: 4594, image: "JayZ.jpg", color: "#5a6fbf" },
    "Luke Bryan": { co2: 4007, image: "LukeBryan.jpg", color: "#e8a87c" },
    "Taylor Swift": { co2: 8294, image: "TaylorSwift.png", color: "#f4a259" },
    "Donald Trump": { co2: 32344, image: "DonaldTrump.jpg", color: "#85c88a" },
    "Kim Kardashian": { co2: 4800, image: "KimKardashian.jpg", color: "#9b72cf" },
    "P.Diddy": { co2: 6150, image: "PDiddy.jpg", color: "#5a6fbf" }
};

// CO2 per item (kg)
const co2PerItem = {
    burgers: 6.61,
    water: 0.0003,
    nuggets: 0.15,
    cigarettes: 0.014,
    uranium: 1e6
};

// ============ QUIZ STATE ============
let currentQuestion = 0;
let selectedAnswer = null;
let totalCO2 = 0;

// ============ DOM ============
const questionEl = document.getElementById('quiz-question');
const optionsEl = document.getElementById('quiz-options');
const stateEl = document.getElementById('quiz-state');
const stateSelect = document.getElementById('state-select');
const nextBtn = document.getElementById('quiz-next-btn');
const resultsEl = document.getElementById('quiz-results');
const resultsValue = document.getElementById('results-value');
const restartBtn = document.getElementById('quiz-restart-btn');
const postQuizScroll = document.getElementById('post-quiz-scroll');
const quizCard = document.querySelector('.quiz-card');

// ============ QUIZ FUNCTIONS ============
function initQuiz() {
    usStates.forEach(state => {
        const opt = document.createElement('option');
        opt.value = state;
        opt.textContent = state;
        stateSelect.appendChild(opt);
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
            btn.className = 'option-btn';
            btn.textContent = opt;
            btn.addEventListener('click', () => {
                document.querySelectorAll('.option-btn').forEach(b => b.classList.remove('selected'));
                btn.classList.add('selected');
                selectedAnswer = i;
            });
            optionsEl.appendChild(btn);
        });
    }
}

function handleNext() {
    const q = quizQuestions[currentQuestion];
    if (q.type === 'dropdown') {
        totalCO2 += 5;
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
    quizCard.style.display = 'none';
    resultsEl.style.display = 'block';
    resultsValue.textContent = totalCO2.toFixed(1) + ' metric tons/year';
    postQuizScroll.style.display = 'block';
    drawCelebrityChart();
}

function restartQuiz() {
    currentQuestion = 0;
    selectedAnswer = null;
    totalCO2 = 0;
    quizCard.style.display = 'block';
    resultsEl.style.display = 'none';
    postQuizScroll.style.display = 'none';
    optionsEl.style.display = 'flex';
    stateEl.style.display = 'none';
    renderQuestion();
}

// ============ BAR CHART ============
function drawCelebrityChart() {
    const container = d3.select('#celebrity-chart');
    container.selectAll('*').remove();

    const data = Object.entries(celebrityData).map(([name, info]) => ({
        name,
        co2: info.co2,
        color: info.color
    }));

    const margin = { top: 30, right: 20, bottom: 80, left: 60 };
    const width = Math.min(650, window.innerWidth - 40) - margin.left - margin.right;
    const height = 350 - margin.top - margin.bottom;

    const svg = container.append('svg')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
        .append('g')
        .attr('transform', `translate(${margin.left},${margin.top})`);

    const x = d3.scaleBand()
        .domain(data.map(d => d.name))
        .range([0, width])
        .padding(0.35);

    const y = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.co2)])
        .nice()
        .range([height, 0]);

    // X axis
    svg.append('g')
        .attr('transform', `translate(0,${height})`)
        .call(d3.axisBottom(x))
        .selectAll('text')
        .attr('transform', 'rotate(-40)')
        .style('text-anchor', 'end')
        .style('font-size', '11px');

    // Y axis
    svg.append('g')
        .call(d3.axisLeft(y).ticks(5).tickFormat(d => d.toLocaleString()))
        .selectAll('text')
        .style('font-size', '10px');

    // Bars with animation on scroll
    const bars = svg.selectAll('.bar')
        .data(data)
        .enter()
        .append('rect')
        .attr('class', 'bar')
        .attr('x', d => x(d.name))
        .attr('width', x.bandwidth())
        .attr('y', height)
        .attr('height', 0)
        .attr('fill', d => d.color)
        .attr('rx', 3);

    // Animate on scroll
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                bars.transition()
                    .duration(800)
                    .delay((d, i) => i * 100)
                    .attr('y', d => y(d.co2))
                    .attr('height', d => height - y(d.co2));
            }
        });
    }, { threshold: 0.4 });
    observer.observe(document.getElementById('chart-section'));
}

// ============ COMPARISON SLIDERS ============
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
    
    celebImage.src = `0_images/celebrities/${celeb.image}`;
    celebImage.alt = selected;
    
    const maxCO2 = 35000;
    celebBar.style.width = (celeb.co2 / maxCO2 * 100) + '%';
    celebValue.textContent = celeb.co2.toLocaleString() + ' metric tons';
    
    finalCelebrity.textContent = selected + "'s";
    updateYourCO2();
}

function updateYourCO2() {
    const b = parseInt(sliderBurgers.value);
    const w = parseInt(sliderWater.value);
    const n = parseInt(sliderNuggets.value);
    const c = parseInt(sliderCigarettes.value);
    const u = parseFloat(sliderUranium.value);

    valBurgers.textContent = b.toLocaleString();
    valWater.textContent = w.toLocaleString();
    valNuggets.textContent = n.toLocaleString();
    valCigarettes.textContent = c.toLocaleString();
    valUranium.textContent = u.toFixed(1);

    const totalKg = b * co2PerItem.burgers + w * co2PerItem.water + n * co2PerItem.nuggets + c * co2PerItem.cigarettes + u * co2PerItem.uranium;
    const totalTons = totalKg / 1000;

    const maxCO2 = 35000;
    yourBar.style.width = Math.min((totalTons / maxCO2 * 100), 100) + '%';
    yourValue.textContent = Math.round(totalTons).toLocaleString() + ' metric tons';

    finalBurgers.textContent = b.toLocaleString();
    finalWater.textContent = w.toLocaleString();
    finalNuggets.textContent = n.toLocaleString();
    finalCigarettes.textContent = c.toLocaleString();
    finalUranium.textContent = u.toFixed(1);
}

celebSelect.addEventListener('change', updateCelebrity);
sliderBurgers.addEventListener('input', updateYourCO2);
sliderWater.addEventListener('input', updateYourCO2);
sliderNuggets.addEventListener('input', updateYourCO2);
sliderCigarettes.addEventListener('input', updateYourCO2);
sliderUranium.addEventListener('input', updateYourCO2);

// ============ INIT ============
document.addEventListener('DOMContentLoaded', () => {
    initQuiz();
    updateCelebrity();
});
