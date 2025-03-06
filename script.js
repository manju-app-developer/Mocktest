let questions = [];
let currentQuestion = 0;
let answers = {};
let timeLeft = 1800; // 30 minutes timer

// Load questions from JSON
fetch('questions.json')
    .then(response => response.json())
    .then(data => {
        questions = data;
        renderQuestion();
        renderQuestionList();
    });

// Start countdown timer
function startTimer() {
    const timer = setInterval(() => {
        let minutes = Math.floor(timeLeft / 60);
        let seconds = timeLeft % 60;
        document.getElementById("time").textContent = `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
        
        if (timeLeft === 0) {
            clearInterval(timer);
            submitTest();
        }
        timeLeft--;
    }, 1000);
}
startTimer();

// Render Question List (Sidebar)
function renderQuestionList() {
    const questionList = document.getElementById("question-list");
    questions.forEach((_, index) => {
        let btn = document.createElement("button");
        btn.textContent = `Q${index + 1}`;
        btn.onclick = () => loadQuestion(index);
        questionList.appendChild(btn);
    });
}

// Render Question
function renderQuestion() {
    const q = questions[currentQuestion];
    const questionContainer = document.getElementById("question-container");
    questionContainer.innerHTML = `<p>${currentQuestion + 1}. ${q.question}</p>`;

    if (q.type === "mcq") {
        q.options.forEach((option, i) => {
            questionContainer.innerHTML += `
                <label>
                    <input type="radio" name="q${currentQuestion}" value="${i}"> ${option}
                </label><br>
            `;
        });
    } else {
        questionContainer.innerHTML += `<input type="text" id="answer${currentQuestion}" placeholder="Enter your answer">`;
    }
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
    document.getElementById(`q${currentQuestion}`).style.background = "yellow";
});

// Submit and Evaluate Test
document.getElementById("submit-btn").addEventListener("click", submitTest);

function submitTest() {
    let score = 0;
    let total = questions.length;
    
    questions.forEach((q, index) => {
        let answer = document.querySelector(`input[name="q${index}"]:checked`);
        let userAnswer = answer ? parseInt(answer.value) : document.getElementById(`answer${index}`).value;
        
        if (q.type === "integer" || q.type === "numerical") {
            userAnswer = parseFloat(userAnswer);
        }

        if (userAnswer == q.correct) {
            score++;
        }
    });

    document.getElementById("result").innerHTML = `You scored ${score} out of ${total}`;
}
