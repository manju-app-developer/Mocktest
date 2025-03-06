let questions = [];
let currentQuestion = 0;
let timeLeft = 1800; // 30 minutes

function startTest() {
    const selectedPaper = document.getElementById("question-set").value;
    fetch(`questions/${selectedPaper}`)
        .then(response => response.json())
        .then(data => {
            questions = data;
            renderQuestion();
        });

    setInterval(() => {
        let minutes = Math.floor(timeLeft / 60);
        let seconds = timeLeft % 60;
        document.getElementById("time").textContent = `${minutes}:${seconds}`;
        if (timeLeft === 0) submitTest();
        timeLeft--;
    }, 1000);
}

function renderQuestion() {
    const q = questions[currentQuestion];
    let content = `<p>${q.question}</p>`;
    
    if (q.image) content += `<img src="images/${q.image}" width="300">`;
    
    if (q.type === "mcq") {
        q.options.forEach((option, i) => {
            content += `<label><input type="radio" name="q${currentQuestion}" value="${i}"> ${option}</label><br>`;
        });
    } else {
        content += `<input type="text" id="answer${currentQuestion}" placeholder="Enter your answer">`;
    }

    document.getElementById("question-container").innerHTML = content;
}

document.getElementById("next-btn").addEventListener("click", () => {
    if (currentQuestion < questions.length - 1) currentQuestion++;
    renderQuestion();
});

document.getElementById("prev-btn").addEventListener("click", () => {
    if (currentQuestion > 0) currentQuestion--;
    renderQuestion();
});

document.getElementById("submit-btn").addEventListener("click", submitTest);

function submitTest() {
    let score = 0;
    questions.forEach((q, index) => {
        let answer = document.querySelector(`input[name="q${index}"]:checked`);
        let userAnswer = answer ? parseInt(answer.value) : document.getElementById(`answer${index}`).value;
        if (q.type !== "mcq") userAnswer = parseFloat(userAnswer);
        if (userAnswer == q.correct) score++;
    });
    document.getElementById("result").innerHTML = `You scored ${score} out of ${questions.length}`;
}
