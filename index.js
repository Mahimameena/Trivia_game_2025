let usersInputSection = document.getElementById("usersInputSection");
let categoryInputSection = document.getElementById("categoryInputSection");
let displayQuestionSection = document.getElementById("displayQuestionSection");
let displayWinnersSection = document.getElementById("displayWinnersSection");

let player1Input = document.getElementById("player1");
let player2Input = document.getElementById("player2");

let categories = document.getElementById("categories");
let player1NameDiv = document.getElementById("player1NameDiv");
let player2NameDiv = document.getElementById("player2NameDiv");

let questionSection = document.getElementById("questionSection");
let currentPlayerScore = document.getElementById("currentPlayerScore");
let nextQuestionBtn = document.getElementById("nextQuestionBtn");
let radio_options = document.getElementsByClassName("radio_options");
let optionsDiv = document.getElementById("optionsDiv");
let error2 = document.getElementById("error2");

let nextRoundBtn = document.getElementById("nextRoundBtn");
let endGameBtn = document.getElementById("endGameBtn");


categoryInputSection.style.display = "none";
displayQuestionSection.style.display = "none";
displayWinnersSection.style.display = "none";
nextQuestionBtn.style.display = "none";
nextRoundBtn.style.display = "none";
endGameBtn.style.display = "none";

let selectedCategories = [];
let allQuestions = [];
let category = "";
let currentTurn = "";
let index = 0;
let questionCount = 1;
let round = 1;
let player1_score = 0;
let player2_score = 0;

const allCategories = [
  "music",
  "sport_and_leisure",
  "film_and_tv",
  "arts_and_literature",
  "history",
  "society_and_culture",
  "science",
  "geography",
  "food_and_drink",
  "general_knowledge",
];

let startGameBtn = document.getElementById("startGameBtn");
startGameBtn.addEventListener("click", function () {
  let error = document.getElementById("error");
  if (player1Input.value.trim() === "" || player2Input.value.trim() === "") {
    error.innerText = "Please Enter Both Players Name";
    return;
  }
  if (player1Input.value === player2Input.value) {
    error.innerText = "Please Add different Players Name";
    return;
  } else {
    error.innerText = "";
    usersInputSection.style.display = "none";
    categoryInputSection.style.display = "block";

    player1NameDiv.innerText = player1Input.value;
    player2NameDiv.innerText = player2Input.value;
  }
});

let startRoundBtn = document.getElementById("startRoundBtn");
startRoundBtn.addEventListener("click", function () {
  let error1 = document.getElementById("error1");
  if (categories.value === "default") {
    error1.innerText = "Please select any category";
    return;
  } else {
    error1.innerText = "";
    category = categories.value;
    selectedCategories.push(category);

    currentTurn = player1Input.value;
    categoryInputSection.style.display = "none";
    displayQuestionSection.style.display = "block";
    optionsDiv.style.display = "none";
    questionSection.style.display = "none";
     error2.innerText = "Questions Fetching....."
    fetchingQuestions();
  }
});

async function fetchingQuestions() {
  try {
    const response1 = await fetch(
      `https://the-trivia-api.com/v2/questions?categories=${category}&difficulties=easy&limit=2`
    );
    let easyQuestions = await response1.json();

    const response2 = await fetch(
      `https://the-trivia-api.com/v2/questions?categories=${category}&difficulties=medium&limit=2`
    );
    let mediumQuestions = await response2.json();

    const response3 = await fetch(
      `https://the-trivia-api.com/v2/questions?categories=${category}&difficulties=hard&limit=2`
    );
    let hardQuestions = await response3.json();

    allQuestions = [...easyQuestions, ...mediumQuestions, ...hardQuestions];
    showQuestion();
  } catch (err) {
    console.log("error fetching questions");
  }
}

function showQuestion() {
  let roundNumber = document.getElementById("roundNumber");
  let questionNumber = document.getElementById("questionNumber");
  let questionCategory = document.getElementById("questionCategory");
  let questionDifficulty = document.getElementById("questionDifficulty");
  let currentPlayerTurn = document.getElementById("currentPlayerTurn");
  let playersScore = document.getElementById("playersScore");
  let questionText = document.getElementById("questionText");

  let question = allQuestions[index];
  let options = [question.correctAnswer, ...question.incorrectAnswers];

  options.sort(function () {
    return Math.random() - 0.5;
  });

  document.getElementById("option1_value").value = options[0];
  document.getElementById("option2_value").value = options[1];
  document.getElementById("option3_value").value = options[2];
  document.getElementById("option4_value").value = options[3];

  document.getElementById("first_option_text").innerText = options[0];
  document.getElementById("second_option_text").innerText = options[1];
  document.getElementById("third_option_text").innerText = options[2];
  document.getElementById("fourth_option_text").innerText = options[3];

  optionsDiv.style.display = "block";
  nextQuestionBtn.style.display = "none";
  questionSection.style.display = "block";
  error2.innerText = "";

  roundNumber.innerText = `Round ${round}`;
  questionNumber.innerText = `Question Number:-  ${questionCount}`;
  questionCategory.innerText = `Question Category:- ${question.category} `;
  questionDifficulty.innerText = `Question Difficulty:- ${question.difficulty}`;
  currentPlayerTurn.innerText = `Current Player's Turn:- ${currentTurn}`;
  playersScore.innerText = ` ${player1Input.value}:- ${player1_score}  ${player2Input.value}:- ${player2_score}`;
  questionText.innerText = `Question:- ${question.question.text}`;

  for (let i = 0; i < radio_options.length; i++) {
    radio_options[i].disabled = false;
    radio_options[i].checked = false;
  }
}

for (i = 0; i < radio_options.length; i++) {
  radio_options[i].addEventListener("change", function () {
    for (j = 0; j < radio_options.length; j++) {
      radio_options[j].disabled = true;
    }
    showAnswer(this.value);
  });
}

function showAnswer(selectedOption) {
  let currentQuestion = allQuestions[index];
  let score = 0;
  if (selectedOption === currentQuestion.correctAnswer) {
    error2.innerText = "✅ Correct Answer!";
    if (currentQuestion.difficulty === "easy") {
      score = 10;
    } else if (currentQuestion.difficulty === "medium") {
      score = 15;
    } else {
      score = 20;
    }
    if (currentTurn === player1Input.value) {
      player1_score += score;
      let current_score1 = score;
      currentPlayerScore.innerText = `${player1Input.value}:- Got ${current_score1} `;
    } else {
      player2_score += score;
      let current_score2 = score;
      currentPlayerScore.innerText = `${player2Input.value}:- Got ${current_score2}`;
    }
  } else {
    error2.innerText = `❌ Wrong Answer! Correct answer is: ${currentQuestion.correctAnswer}`;
  }
  nextQuestionBtn.style.display = "block";
}

nextQuestionBtn.addEventListener("click", function () {
  currentPlayerScore.innerText = "";
  error2.innerText = "";
  index++;
  questionCount++;
  if (currentTurn === player1Input.value) {
    currentTurn = player2Input.value;
  } else {
    currentTurn = player1Input.value;
  }
  if (index < allQuestions.length) {
    showQuestion();
  } else {
    if (selectedCategories.length === allCategories.length) {
      nextRoundBtn.disabled = true;
    }
    nextQuestionBtn.style.display = "none";
    nextRoundBtn.style.display = "block";
    endGameBtn.style.display = "block";
  }
});

nextRoundBtn.addEventListener("click", function () {
  let countRound = document.getElementById("countRound");
  round++;
  countRound.innerHTML = `Round:- ${round}`;
  index = 0;
  questionCount = 1;
  nextRoundBtn.style.display = "none";
  displayQuestionSection.style.display = "none";
  endGameBtn.style.display = "none";
  categoryInputSection.style.display = "block";

  const leftCategories = allCategories.filter(function (category) {
    return !selectedCategories.includes(category);
  });

  categories.innerHTML = `<option value="default" default>Choose a Category</option>`;
  leftCategories.forEach(function (cat) {
    const option = document.createElement("option");
    option.innerText = cat;
    option.value = cat;
    categories.appendChild(option);
  });
});

endGameBtn.addEventListener("click", function () {
  let result = document.getElementById("result");
  displayQuestionSection.style.display = "none";
  displayWinnersSection.style.display = "block";

  if (player1_score > player2_score) {
    result.innerText = `${player1Input.value} Won `;
  } else if (player1_score < player2_score) {
    result.innerText = `${player2Input.value} Won `;
  } else {
    result.innerText = "It's a Draw!";
  }
  let player1Status = document.getElementById("player1Status");
  let player2Status = document.getElementById("player2Status");
  player1Status.innerText = ` ${player1Input.value} Score is :- ${player1_score}`;
  player2Status.innerText = ` ${player2Input.value} Score is :- ${player2_score}`;
});
