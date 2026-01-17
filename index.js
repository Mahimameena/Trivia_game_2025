let usersInputSection = document.getElementById("usersInputSection");
let categoryInputSection = document.getElementById("categoryInputSection");
let displayQuestionSection = document.getElementById("displayQuestionSection");
let roundSummary = document.getElementById("roundSummary");
let displayWinnersSection = document.getElementById("displayWinnersSection");

let categories = document.getElementById("categories");
let radio_options = document.getElementsByClassName("radio_options");
let questionSection=document.getElementById("questionSection");
let optionsDiv=document.getElementById("optionsDiv");
let error2 = document.getElementById("error2");
let currentPlayerScore = document.getElementById("currentPlayerScore");
let playersScore=document.getElementById("playersScore");
let nextQuestionBtn = document.getElementById("nextQuestionBtn");

categoryInputSection.style.display = "none";
displayQuestionSection.style.display = "none";
roundSummary.style.display = "none";
displayWinnersSection.style.display = "none";
nextQuestionBtn.disabled = true;

let selectedCategories = [];
let selectedCategory="";
let allQuestions = [];
let currentTurn = "";
let index = 0;
let questionCount = 1;
let round = 1;
let player1_score = 0;
let player2_score = 0;
let player1Name = "";
let player2Name = "";

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
  let player1Input = document.getElementById("player1");
  let player2Input = document.getElementById("player2");
  let player1Value = document.getElementById("player1Value");
  let player2Value = document.getElementById("player2Value");
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

    player1Name = player1Input.value;
    player2Name = player2Input.value;

    player1Value.innerText = player1Name;
    player2Value.innerText = player2Name;
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
    selectedCategory = categories.value;
    selectedCategories.push(selectedCategory);
    currentTurn = player1Name;
    categoryInputSection.style.display = "none";
    displayQuestionSection.style.display = "block";
    fetchingQuestions();
    optionsDiv.style.display="none";
    questionSection.style.display="none";
    error2.innerText = "Loading....."
  }
});

async function fetchingQuestions() {
  try {
    const response1 = await fetch(
      `https://the-trivia-api.com/v2/questions?categories=${selectedCategory}&difficulties=easy&limit=2`
    );
    let easyQuestions = await response1.json();

    const response2 = await fetch(
      `https://the-trivia-api.com/v2/questions?categories=${selectedCategory}&difficulties=medium&limit=2`
    );
    let mediumQuestions = await response2.json();

    const response3 = await fetch(
      `https://the-trivia-api.com/v2/questions?categories=${selectedCategory}&difficulties=hard&limit=2`
    );
    let hardQuestions = await response3.json();

    allQuestions = [...easyQuestions, ...mediumQuestions, ...hardQuestions];
    showQuestion();
     optionsDiv.style.display="block";
     questionSection.style.display="block";
     error2.innerText="";
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

  roundNumber.innerText = `Round ${round}`;
  questionNumber.innerText = `Question Number:-  ${questionCount}`;
  questionCategory.innerText = `Question Category:- ${question.category} `;
  questionDifficulty.innerText = `Question Difficulty:- ${question.difficulty}`;
  currentPlayerTurn.innerText = `Current Player's Turn:- ${currentTurn}`;
  playersScore.innerText = ` ${player1Name}:- ${player1_score}  ${player2Name}:- ${player2_score}`;
  questionText.innerText = `Question:- ${question.question.text}`;

  for (let i = 0; i < radio_options.length; i++) {
    radio_options[i].disabled = false;
    radio_options[i].checked = false;
  }
}

for (let i = 0; i < radio_options.length; i++) {
  radio_options[i].addEventListener("change", function () {
    for (let j = 0; j < radio_options.length; j++) {
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
    if (currentTurn === player1Name) {
      player1_score += score;
      let current_score1 = score;
      currentPlayerScore.innerText = `${player1Name}:- Got ${current_score1} `;
    } else {
      player2_score += score;
      let current_score2 = score;
      currentPlayerScore.innerText = `${player2Name}:- Got ${current_score2}`;
    }
     playersScore.innerText = `${player1Name} :- ${player1_score}    ${player2Name} :- ${player2_score}`;

  } else {
    error2.innerText = `❌ Wrong Answer! Correct answer is: ${currentQuestion.correctAnswer}`;
  }

  nextQuestionBtn.disabled = false;
}

nextQuestionBtn.addEventListener("click", function () {
  nextQuestionBtn.disabled = true;
  error2.innerText = "";
  currentPlayerScore.innerText="";
  index++;
  questionCount++;
  if (currentTurn === player1Name) {
    currentTurn = player2Name;
  } else {
    currentTurn = player1Name;
  }
  if (index < allQuestions.length) {
    showQuestion();
  } else {
    if (selectedCategories.length === allCategories.length) {
      nextRoundBtn.disabled = true;
    }
    roundSummary.style.display = "block";
    displayQuestionSection.style.display = "none";
  }
});

let nextRoundBtn = document.getElementById("nextRoundBtn");
nextRoundBtn.addEventListener("click", function () {
  let countRound = document.getElementById("countRound");
  round++;
  countRound.innerHTML = `Round:- ${round}`;
  index = 0;
  questionCount = 1;
  roundSummary.style.display = "none";
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

let endGameBtn = document.getElementById("endGameBtn");
endGameBtn.addEventListener("click", function () {
  let result = document.getElementById("result");
  roundSummary.style.display = "none";
  displayWinnersSection.style.display = "block";

  if (player1_score > player2_score) {
    result.innerText = `${player1Name} Won `;
  } else if (player1_score < player2_score) {
    result.innerText = `${player2Name} Won `;
  } else {
    result.innerText = "It's a Draw!";
  }
  let player1Status = document.getElementById("player1Status");
  let player2Status = document.getElementById("player2Status");
  player1Status.innerText = ` ${player1Name} Score is :- ${player1_score}`;
  player2Status.innerText = ` ${player2Name} Score is :- ${player2_score}`;
});
