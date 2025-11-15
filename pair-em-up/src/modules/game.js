import { createScreen } from "./screen.js";
import { generateNumbers } from "./generator.js";
import { createSettings } from "./settings.js";
import { playSound } from "./playSound.js";
import soundFile from "./sound.mp3";
import assistSound from "./assist.mp3";

const COLS = 9;
const TARGET_SCORE = 100;

let state = {};

export const startGame = (mode) => {
  state.mode = mode;
  state.score = 0;
  state.selected = [];
  state.lock = false;
  state.numbers = generateNumbers(mode);
  state.cols = COLS;
  createGameLayout(mode);
  if (localStorage.getItem("musicStartEnd") === "true") {
    playSound(soundFile);
  }

  stopTimer();
  startTimer();
};

const createGameLayout = (mode) => {
  document.body.innerHTML = "";
  document.body.append(createHeader(mode), createBoard(), createFooter());
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

  const btnReset = createBtn("Reset");
  const btnBack = createBtn("Back");

  btnReset.addEventListener("click", () => startGame(mode));
  btnBack.addEventListener("click", () => createScreen());
  btnContainer.append(btnReset, btnBack);

  section.append(title, score, timer, btnContainer);
  return section;
};

const createBoard = () => {
  const board = document.createElement("div");
  board.className = "board";
  board.style.backgroundColor = localStorage["gridColor"] || "#68d073ff";
  state.numbers.forEach((n, idx) => {
    const cell = document.createElement("div");
    cell.className = "cell";
    cell.dataset.index = idx;
    cell.dataset.value = n;
    cell.innerHTML = `<div class="cell-num">${n}</div>`;
    cell.style.border =
      `1px solid ${localStorage["uiColor"]}` || `1px solid #0c3e05ff`;
    board.append(cell);
    cell.addEventListener("mouseenter", () => {
      cell.style.backgroundColor =
        localStorage["interactiveColor"] || "#4caf50";
    });
    cell.addEventListener("mouseleave", () => {
      cell.style.backgroundColor = "#ffffff";
    });
  });

  return board;
};

const createFooter = () => {
  const section = document.createElement("section");
  section.className = "game-footer";

  section.append(
    createBtn("Continue game"),
    createBtn("Save game"),
    createBtn("Assist"),
    createBtn("Settings")
  );

  section.addEventListener("click", (e) => {
    if (e.target.textContent === "Continue game") {
      startGame(state.mode);
    } else if (e.target.textContent === "Save game") {
      saveGame();
    } else if (e.target.textContent === "Assist") {
      if (localStorage.getItem("assistTool") === "true") {
        playSound(assistSound);
      }
      assist();
    } else if (e.target.textContent === "Settings") {
      createSettings();
    }
  });

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

function hoverBtn(btn) {
  btn.addEventListener("mouseenter", () => {
    btn.style.backgroundColor = localStorage["interactiveColor"] || "#87a788";
  });
  btn.addEventListener("mouseleave", () => {
    btn.style.backgroundColor = localStorage["uiColor"] || "#4caf50";
  });
}

function createBtn(text) {
  const btn = document.createElement("button");
  btn.textContent = text;
  btn.className = "game-btn";
  btn.style.backgroundColor = localStorage["uiColor"] || "#4caf50";
  hoverBtn(btn);
  return btn;
}
