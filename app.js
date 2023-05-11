// Define quiz questions
const questions = [
	{
		question: "What is the difference between let and var in JavaScript?",
		choices: ["let has block scope and var has function scope",
		"let has function scope and var has block scope",
		"let is used for declaring constants and var is used for variables",
		"there is no difference, they can be used interchangeably"],
		answer: 0
	},
	{
		question: "What is the event loop in JavaScript?",
		choices: ["a data structure used for asynchronous programming",
		"a loop that runs continuously in the background of a web page",
		"a way to handle user input events in JavaScript",
		"a mechanism that helps JavaScript manage asynchronous operations"],
		answer: 3
	},
	{
		question: "What is a closure in JavaScript?",
		choices: ["a way to hide implementation details of a function",
		"a data structure used to store multiple values",
		"a way to create private variables and functions in JavaScript",
		"a mechanism used to manipulate the DOM in JavaScript"],
		answer: 2
	},
	{
		question: "What is a higher-order function in JavaScript?",
		choices: ["a function that takes one or more functions as arguments",
		"a function that always returns a value",
		"a function that is called multiple times in a program",
		"a function that takes one or more arrays as arguments"],
		answer: 0
	},
	{
		question: "What is the purpose of the 'use strict' statement in JavaScript?",
		choices: [ "to enforce stricter parsing and error handling in JavaScript",
		"to enable debugging features in JavaScript",
		"to allow the use of non-standard JavaScript features",
		"to improve performance in JavaScript"],
		answer: 0
	}
];

// Define variables
let currentQuestionIndex = 0;
let remainingTime = 60;
let score = 0;
let timerId;


// Define functions
function startQuiz() {
	currentQuestionIndex = 0;
	remainingTime = 60;
	score = 0;
	shuffleQuestions();
	showQuestion();
	startTimer();
}

function shuffleQuestions() {
	for (let i = questions.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[questions[i], questions[j]] = [questions[j], questions[i]];
	}
}

function showQuestion() {
	const question = questions[currentQuestionIndex];
	document.getElementById("question").textContent = question.question;
	const choices = document.getElementById("choices");
	choices.innerHTML = "";
	for (let i = 0; i < question.choices.length; i++) {
		const choice = question.choices[i];
		const li = document.createElement("li");
		const input = document.createElement("input");
		input.type = "radio";
		input.name = "choice";
		input.value = i;
		input.id = "choice" + i;
		const label = document.createElement("label");
		label.htmlFor = "choice" + i;
		label.textContent = choice;
		li.appendChild(input);
		li.appendChild(label);
		choices.appendChild(li);
	}
	const submitButton = document.createElement("button");
	submitButton.textContent = "Submit";
	choices.appendChild(submitButton);
	submitButton.addEventListener("click", function() {
		const selectedChoice = document.querySelector('input[name="choice"]:checked');
		if (!selectedChoice) {
			return;
		}
		const selectedAnswer = parseInt(selectedChoice.value);
		const correctAnswer = question.answer;
		if (selectedAnswer === correctAnswer) {
			score++;
		}
		currentQuestionIndex++;
		if (currentQuestionIndex >= questions.length) {
			endGame();
		} else {
			showQuestion();
		}
	});
}  

function startTimer() {
	timerId = setInterval(() => {
		remainingTime--;
		document.getElementById("timer").textContent = remainingTime;
		if (remainingTime <= 0) {
		endGame();
		}
	}, 1000);
}

function endGame() {
	clearInterval(timerId); 
	document.getElementById("quizContainer").classList.add("hidden");
	document.getElementById("gameOverContainer").classList.remove("hidden");
	document.getElementById("score").textContent = score;
}

function submitScore(event) {
	event.preventDefault();
	const initials = document.getElementById("initials").value;
	const highScores = JSON.parse(localStorage.getItem("highScores") || "[]");
	highScores.push({ initials, score });
	highScores.sort((a, b) => b.score - a.score);
	localStorage.setItem("highScores", JSON.stringify(highScores));
	showHighScores();
}

function showHighScores() {
	const highScores = JSON.parse(localStorage.getItem("highScores") || "[]");
	const table = document.getElementById("high-scores");
	table.innerHTML = "";
	for (let i = 0; i < highScores.length; i++) {
		const { initials, score } = highScores[i];
		const tr = document.createElement("tr");
		const tdInitials = document.createElement("td");
		tdInitials.textContent = initials;
		const tdScore = document.createElement("td");
		tdScore.textContent = score;
		tr.appendChild(tdInitials);
		tr.appendChild(tdScore);
		table.appendChild(tr);
	}
}

function saveHighScore(initials, score) {
	const highScores = JSON.parse(localStorage.getItem("highScores") || "[]");
	highScores.push({ initials, score });
	highScores.sort((a, b) => b.score - a.score);
	localStorage.setItem("highScores", JSON.stringify(highScores));
}

// Event listener for starting the quiz
startButton.addEventListener("click", function() {
	introContainer.classList.add("hidden");
	quizContainer.classList.remove("hidden");
	startQuiz();
});

// Event listener for submitting the initials and score
saveScore.addEventListener("click", function(event) {
	event.preventDefault();
	const initialsInput = document.getElementById("initials");
	const initials = initialsInput.value.trim().toUpperCase();
	if (initials === "") {
    	return;
	}
	saveHighScore(initials, score);
	showHighScores();
	quizContainer.classList.add("hidden") 
	gameOverContainer.classList.add("hidden")
	highScoresContainer.classList.remove("hidden")
});
// Event listener for returning to the home screen
goBackButton.addEventListener("click", function() {
	highScoresContainer.classList.add("hidden")
	gameOverContainer.classList.add("hidden")
	introContainer.classList.remove("hidden")
});

// Event listener for clearing the high scores
clearHighScoresButton.addEventListener("click", function() {
	localStorage.removeItem("highScores");
	showHighScores();
});
