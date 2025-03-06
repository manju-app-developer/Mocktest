let timeLeft = 1800; // 30 minutes timer

// Load questions from JSON
fetch('questions.json')
    .then(response => response.json())
    .then(questions => {
        const quizForm = document.getElementById("quiz-form");

        questions.forEach((q, index) => {
            const questionDiv = document.createElement("div");
            questionDiv.classList.add("question");

            let optionsHtml = "";
            q.options.forEach((option, i) => {
                optionsHtml += `
                    <label>
                        <input type="radio" name="q${index}" value="${i}"> ${option}
                    </label><br>
                `;
            });

            questionDiv.innerHTML = `<p>${index + 1}. ${q.question}</p>${optionsHtml}`;
            quizForm.appendChild(questionDiv);
        });
    });

// Start countdown timer
const timerElement = document.getElementById("time");
function startTimer() {
    const timer = setInterval(() => {
        let minutes = Math.floor(timeLeft / 60);
        let seconds = timeLeft % 60;
        timerElement.textContent = `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
        
        if (timeLeft === 0) {
            clearInterval(timer);
            submitTest();
        }
        timeLeft--;
    }, 1000);
}
startTimer();

// Submit and evaluate test
document.getElementById("submit-btn").addEventListener("click", submitTest);

function submitTest() {
    fetch('questions.json')
        .then(response => response.json())
        .then(questions => {
            let score = 0;
            let total = questions.length;
            const formData = new FormData(document.getElementById("quiz-form"));

            questions.forEach((q, index) => {
                const selectedAnswer = formData.get(`q${index}`);
                if (selectedAnswer !== null && parseInt(selectedAnswer) === q.correct) {
                    score++;
                }
            });

            document.getElementById("result").innerHTML = `You scored ${score} out of ${total}`;
        });
}
