let questions = [];
let currentQuestion = 0;
let answers = {};
let timeLeft = 1800; // 30 minutes countdown

// Fetch selected question paper
function startTest() {
    const selectedPaper = document.getElementById("question-set").value;
    fetch(`questions/${selectedPaper}`)
        .then(response => response.json())
        .then(data => {
            questions = data;
            renderQuestion();
            renderQuestionList();
        });

    // Start Timer
    setInterval(() => {
        let minutes = Math.floor(timeLeft / 60);
        let seconds = timeLeft % 60;
        document.getElementById("time").textContent = `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
        if (timeLeft === 0) submitTest();
        timeLeft--;
    }, 1000);
}

// Render Question List (Sidebar)
function renderQuestionList() {
    const questionList = document.getElementById("question-list");
    questionList.innerHTML = "";
    questions.forEach((_, index) => {
        let btn = document.createElement("button");
        btn.textContent = `Q${index + 1}`;
        btn.onclick = () => loadQuestion(index);
        btn.id = `q-btn-${index}`;
        questionList.appendChild(btn);
    });
}

// Render a Question
function renderQuestion() {
    const q = questions[currentQuestion];
    const questionContainer = document.getElementById("question-container");
    
    let content = `<h3>Question ${currentQuestion + 1}:</h3>`;
    content += `<p>${q.question}</p>`;

    if (q.image) {
        content += `<img src="images/${q.image}" width="300" alt="Question Image"><br>`;
    }

    // Render MCQ
    if (q.type === "mcq") {
        q.options.forEach((option, i) => {
            let checked = answers[currentQuestion] === i ? "checked" : "";
            content += `
                <label>
                    <input type="radio" name="q${currentQuestion}" value="${i}" ${checked} onchange="saveAnswer(${currentQuestion}, ${i})"> ${option}
                </label><br>
            `;
        });
    } 
    // Render Integer/Numerical Input
    else {
        let userInput = answers[currentQuestion] !== undefined ? answers[currentQuestion] : "";
        content += `<input type="text" id="answer${currentQuestion}" value="${userInput}" placeholder="Enter your answer" oninput="saveTextAnswer(${currentQuestion})">`;
    }

    questionContainer.innerHTML = content;
}

// Save Selected MCQ Answer
function saveAnswer(questionIndex, answer) {
    answers[questionIndex] = answer;
    document.getElementById(`q-btn-${questionIndex}`).style.backgroundColor = "lightgreen"; // Mark as answered
}

// Save Integer/Numerical Input Answer
function saveTextAnswer(questionIndex) {
    answers[questionIndex] = document.getElementById(`answer${questionIndex}`).value;
    document.getElementById(`q-btn-${questionIndex}`).style.backgroundColor = "lightgreen"; // Mark as answered
}

// Load a Question
function loadQuestion(index) {
    currentQuestion = index;
    renderQuestion();
}

// Navigation
document.getElementById("next-btn").addEventListener("click", () => {
    if (currentQuestion < questions.length - 1) {
        currentQuestion++;
        renderQuestion();
    }
});

document.getElementById("prev-btn").addEventListener("click", () => {
    if (currentQuestion > 0) {
        currentQuestion--;
        renderQuestion();
    }
});

// Mark for Review
document.getElementById("mark-btn").addEventListener("click", () => {
    document.getElementById(`q-btn-${currentQuestion}`).style.background = "yellow"; // Mark for review
});

// Submit and Evaluate Test
document.getElementById("submit-btn").addEventListener("click", submitTest);

function submitTest() {
    let score = 0;
    let total = questions.length;

    questions.forEach((q, index) => {
        let userAnswer = answers[index];

        if (q.type === "integer" || q.type === "numerical") {
            userAnswer = parseFloat(userAnswer);
        }

        if (userAnswer == q.correct) {
            score++;
        }
    });

    document.getElementById("result").innerHTML = `You scored ${score} out of ${total}`;
}
