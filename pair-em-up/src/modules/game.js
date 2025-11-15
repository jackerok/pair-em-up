import { createScreen } from "./screen.js";

const COLS = 9;
const TARGET_SCORE = 100;

let state = {};

export const startGame = (mode) => {
  createGameLayout(mode);

  stopTimer();
  startTimer();
};

const createGameLayout = (mode) => {
  document.body.innerHTML = "";
  console.log("new", mode);

  document.body.append(createHeader(mode));
};

const createHeader = (mode) => {
  const section = document.createElement("section");
  section.className = "game-header";

  const title = document.createElement("h2");
  title.textContent = `Mode: ${mode}`;
  title.className = "game-title";

  const score = document.createElement("div");
  score.textContent = `Score: 0 / ${TARGET_SCORE}`;

  const timer = document.createElement("div");
  timer.className = "timer";
  const timerText = document.createElement("p");
  timerText.textContent = "Time:";
  const timerValue = document.createElement("p");
  timerValue.textContent = "00:00";
  timerValue.id = "timer";
  timer.append(timerText, timerValue);

  const btnContainer = document.createElement("div");
  btnContainer.className = "btn-container";

  const btnReset = document.createElement("button");
  const btnBack = document.createElement("button");

  btnReset.textContent = "Reset";
  btnBack.textContent = "Back";
  btnBack.className = "game-btn";
  btnReset.className = "game-btn";

  btnReset.style.backgroundColor = localStorage["uiColor"] || "#4caf50";
  btnBack.style.backgroundColor = localStorage["uiColor"] || "#4caf50";
  btnReset.addEventListener("click", () => startGame(mode));
  btnBack.addEventListener("click", () => createScreen());
  btnContainer.append(btnReset, btnBack);

  section.append(title, score, timer, btnContainer);
  return section;
};

function startTimer() {
  const timerEl = document.getElementById("timer");
  let seconds = 0;
  state.timerInterval = setInterval(() => {
    seconds++;
    const mm = String(Math.floor(seconds / 60)).padStart(2, "0");
    const ss = String(seconds % 60).padStart(2, "0");
    timerEl.textContent = `${mm}:${ss}`;
    state.time = seconds;
  }, 1000);
}

function stopTimer() {
  if (state.timerInterval) {
    clearInterval(state.timerInterval);
    state.timerInterval = null;
  }
}
