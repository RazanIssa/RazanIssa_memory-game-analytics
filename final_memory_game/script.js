let matched = 0;
let cardOne, cardTwo;
let disableDeck = false;

let moves = 0;
let startTime;
let endTime;
let timerStarted = false;

let playerStats = {
  name: "",
  moves: 0,
  duration: 0,
  date: "",
  success: true
};

function startGame() {
  const nameInput = document.getElementById("player-name");
  const playerName = nameInput.value.trim();

  if (playerName === "") {
    alert("يرجى إدخال اسمك أولاً!");
    return;
  }

  localStorage.setItem("playerName", playerName);
  playerStats.name = playerName;
  playerStats.date = new Date().toLocaleString();

  document.querySelector(".player-input").style.display = "none";
  document.querySelector(".wrapper").style.display = "block";

  shuffleCard();
}

function flipCard({ target: clickedCard }) {
  if (
    cardOne !== clickedCard &&
    !disableDeck &&
    !clickedCard.classList.contains("flip")
  ) {
    if (!timerStarted) {
      startTime = new Date();
      timerStarted = true;
    }

    clickedCard.classList.add("flip");

    if (!cardOne) {
      cardOne = clickedCard;
      return;
    }

    cardTwo = clickedCard;
    disableDeck = true;
    moves++;
    playerStats.moves = moves;

    const img1 = cardOne.querySelector(".back-view img").src;
    const img2 = cardTwo.querySelector(".back-view img").src;

    matchCards(img1, img2);
  }
}

function matchCards(img1, img2) {
  if (img1 === img2) {
    matched++;

    if (matched === 8) {
      setTimeout(() => {
        endGame();
      }, 1000);
    }

    cardOne.removeEventListener("click", flipCard);
    cardTwo.removeEventListener("click", flipCard);
    resetCards();
  } else {
    setTimeout(() => {
      cardOne.classList.remove("flip");
      cardTwo.classList.remove("flip");
      resetCards();
    }, 1000);
  }
}

function resetCards() {
  cardOne = cardTwo = "";
  disableDeck = false;
}

function shuffleCard() {
  matched = 0;
  moves = 0;
  timerStarted = false;

  cardOne = cardTwo = "";
  disableDeck = false;

  const cards = document.querySelectorAll(".card");
  const images = Array.from({ length: 8 }, (_, i) => `images/img-${i + 1}.png`);
  const allImages = [...images, ...images];

  allImages.sort(() => Math.random() - 0.5);

  cards.forEach((card, i) => {
    card.classList.remove("flip");
    let imgTag = card.querySelector(".back-view img");
    imgTag.src = allImages[i];
    card.addEventListener("click", flipCard);
  });
}

function endGame() {
  endTime = new Date();
  let duration = Math.floor((endTime - startTime) / 1000);
  playerStats.duration = duration;

  saveStats();
  alert("تهانينا! لقد أكملت اللعبة في " + duration + " ثانية وبـ " + moves + " حركة.");
}

function saveStats() {
  let stats = JSON.parse(localStorage.getItem("allPlayerStats")) || [];
  stats.push(playerStats);
  localStorage.setItem("allPlayerStats", JSON.stringify(stats));
}

function showStatsTable() {
  let stats = JSON.parse(localStorage.getItem("allPlayerStats")) || [];
  const table = document.getElementById("stats-table-body");
  table.innerHTML = "";
  stats.forEach((entry, index) => {
    const row = `
      <tr>
        <td>${index + 1}</td>
        <td>${entry.name}</td>
        <td>${entry.moves}</td>
        <td>${entry.duration} ثانية</td>
        <td>${entry.date}</td>
      </tr>
    `;
    table.innerHTML += row;
  });
}
