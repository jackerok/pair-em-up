import { createScreen } from "./screen.js";
import { generateNumbers } from "./generator.js";
import { createSettings } from "./settings.js";
import { playSound } from "./playSound.js";
import soundFile from "./sound.mp3";
import assistSound from "./assist.mp3";
import winSound from "./win.mp3";
import successSound from "./success.mp3";
import soundError from "./error.mp3";

const COLS = 9;
const TARGET_SCORE = 100;
const MAX_ROWS = 50;
const MAX_ASSISTS = 10;
const MAX_MIX = 5;
const MAX_ERASER = 5;

let state = {};

export const startGame = (mode) => {
  state.mode = mode;
  state.score = 0;
  state.selected = [];
  state.lock = false;
  state.numbers = generateNumbers(mode);
  state.cols = COLS;
  state.assistCount = MAX_ASSISTS;
  createGameLayout(mode);
  if (localStorage.getItem("musicStartEnd") === "true") {
    playSound(winSound);
  }
  stopTimer();
  startTimer();
  updateAssistBtn();
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
  score.id = "score";
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
    cell.style.border = `1px solid ${localStorage["uiColor"] || "#0c3e05ff"}`;

    cell.addEventListener("mouseenter", () => {
      if (!cell.classList.contains("selected")) {
        cell.style.backgroundColor =
          localStorage["interactiveColor"] || "#4caf50";
      }
    });
    cell.addEventListener("mouseleave", () => {
      if (!cell.classList.contains("selected")) {
        cell.style.backgroundColor = "#ffffff";
      }
    });

    cell.addEventListener("click", () => handleCellClick(cell));

    board.append(cell);
  });

  return board;
};

function showHint() {
  if (!state.numbers) return;

  const cells = document.querySelectorAll(".cell");
  const cols = state.cols;
  let count = 0;

  cells.forEach((cell) => {
    if (
      !cell.classList.contains("matched") &&
      !cell.classList.contains("selected")
    ) {
      cell.style.backgroundColor = "#ffffff";
    }
  });

  for (let i = 0; i < state.numbers.length; i++) {
    const val1 = state.numbers[i];
    if (val1 === null) continue;

    for (let j = i + 1; j < state.numbers.length; j++) {
      const val2 = state.numbers[j];
      if (val2 === null) continue;

      if (canPair(i, j) && (val1 === val2 || val1 + val2 === 10)) {
        count++;

        if (
          !cells[i].classList.contains("matched") &&
          !cells[i].classList.contains("selected")
        ) {
          cells[i].style.backgroundColor = "orange";
        }
        if (
          !cells[j].classList.contains("matched") &&
          !cells[j].classList.contains("selected")
        ) {
          cells[j].style.backgroundColor = "orange";
        }
      }
    }
  }

  setTimeout(() => {
    cells.forEach((cell) => {
      if (
        !cell.classList.contains("matched") &&
        !cell.classList.contains("selected")
      ) {
        cell.style.backgroundColor = "#ffffff";
      }
    });
  }, 1500);

  const btn = document.getElementById("hint-btn");
  btn.textContent = count > 5 ? "Hints (5+)" : `Hints (${count})`;
  checkLose();
}

function createFooter() {
  const section = document.createElement("section");
  section.className = "game-footer";

  const status = document.createElement("div");
  status.className = "game-status";

  const continueBtn = createBtn("Continue game");
  const saveBtn = createBtn("Save game");
  const assistBtn = createBtn(`Add rows (${state.assistCount})`);
  assistBtn.id = "assist-btn";

  const hintBtn = createBtn(`Hints (0)`);
  hintBtn.id = "hint-btn";
  state.hintCount = 0;

  const undoBtn = createBtn("Undo");
  undoBtn.id = "undo-btn";
  state.undoUsed = false;

  const mixBtn = createBtn(`Mix (${MAX_MIX})`);
  mixBtn.id = "mix-btn";
  state.mixUsed = 0;

  const eraserBtn = createBtn(`Eraser (${MAX_ERASER})`);
  eraserBtn.id = "eraser-btn";
  state.eraserUsed = 0;

  const settingsBtn = createBtn("Settings");

  section.append(
    continueBtn,
    saveBtn,
    settingsBtn,
    assistBtn,
    hintBtn,
    undoBtn,
    mixBtn,
    eraserBtn,
    status
  );

  section.addEventListener("click", (e) => {
    const target = e.target;

    switch (target.id) {
      case "assist-btn":
        useAssist();
        break;
      case "hint-btn":
        if (localStorage.getItem("assistTool") === "true") {
          playSound(assistSound);
        }
        showHint();
        break;
      case "undo-btn":
        if (localStorage.getItem("assistTool") === "true") {
          playSound(assistSound);
        }
        undoMove();
        break;
      case "mix-btn":
        if (localStorage.getItem("assistTool") === "true") {
          playSound(assistSound);
        }
        mixBoard();
        break;
      case "eraser-btn":
        useEraser();
        break;
    }

    if (target.textContent === "Continue game") {
      startGame(state.mode);
    } else if (target.textContent === "Save game") {
      saveGame();
    } else if (target.textContent === "Settings") {
      createSettings();
    }
  });

  return section;
}

function undoMove() {
  if (state.history.length === 0) return;

  const lastMove = state.history.pop();
  lastMove.forEach(({ index, value }) => {
    state.numbers[index] = value;
  });

  reRenderBoard();
  updateScore();
}

function mixBoard() {
  if (state.mixUsed >= MAX_MIX) return;

  const numbers = state.numbers.filter((n) => n !== null);
  for (let i = numbers.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [numbers[i], numbers[j]] = [numbers[j], numbers[i]];
  }

  let idx = 0;
  state.numbers = state.numbers.map((n) =>
    n === null ? null : numbers[idx++]
  );
  reRenderBoard();

  state.mixUsed++;
  const btn = document.getElementById("mix-btn");
  btn.textContent = `Mix (${MAX_MIX - state.mixUsed})`;
  saveGame();
}

function useEraser() {
  if (state.eraserUsed >= MAX_ERASER || state.selected.length === 0) return;

  const idx = state.selected[0];
  state.numbers[idx] = null;
  state.selected = [];
  reRenderBoard();
  if (localStorage.getItem("assistTool") === "true") {
    playSound(assistSound);
  }
  state.eraserUsed++;
  const btn = document.getElementById("eraser-btn");
  btn.textContent = `Eraser (${MAX_ERASER - state.eraserUsed})`;
  saveGame();
}

const handleCellClick = (cell) => {
  if (state.lock) return;
  const index = +cell.dataset.index;

  if (state.selected.includes(index)) {
    state.selected = state.selected.filter((i) => i !== index);
    cell.classList.remove("selected");
    if (localStorage.getItem("invalidPair") === "true") {
      playSound(soundError);
    }
    return;
  }

  if (state.selected.length >= 2) return;

  state.selected.push(index);
  cell.classList.add("selected");
  if (localStorage.getItem("cellSelection") === "true") {
    playSound(soundFile);
  }

  if (state.selected.length === 2) {
    checkPair();
  }
};

const checkPair = () => {
  state.lock = true;
  const [i1, i2] = state.selected;
  const val1 = state.numbers[i1];
  const val2 = state.numbers[i2];
  const cells = document.querySelectorAll(".cell");
  const cell1 = cells[i1];
  const cell2 = cells[i2];

  let points = 0;

  if (!canPair(i1, i2)) {
    setTimeout(() => {
      cell1.classList.remove("selected");
      cell2.classList.remove("selected");
      if (localStorage.getItem("invalidPair") === "true") {
        playSound(soundError);
      }
      state.selected = [];
      state.lock = false;
    }, 300);
    return;
  }

  if (val1 === val2 && val1 === 5) {
    points = 3;
  } else if (val1 === val2) {
    points = 1;
  } else if (val1 + val2 === 10) {
    points = 2;
  }

  if (points > 0) {
    setTimeout(() => {
      cell1.innerHTML = "";
      cell2.innerHTML = "";
      state.numbers[i1] = null;
      state.numbers[i2] = null;
      cell1.classList.add("matched");
      cell2.classList.add("matched");
      state.score += points;
      updateScore();
      if (localStorage.getItem("correctPair") === "true") {
        playSound(successSound);
      }
      state.selected = [];
      state.lock = false;
      checkWin();
      saveGame();
      checkLose();
    }, 300);
  } else {
    setTimeout(() => {
      cell1.classList.remove("selected");
      cell2.classList.remove("selected");
      if (localStorage.getItem("invalidPair") === "true") {
        playSound(soundError);
      }
      state.selected = [];
      state.lock = false;
    }, 500);
  }
};

const canPair = (i1, i2) => {
  const cols = state.cols;
  const numbers = state.numbers;

  if (i1 === i2) return false;

  const row1 = Math.floor(i1 / cols);
  const row2 = Math.floor(i2 / cols);
  const col1 = i1 % cols;
  const col2 = i2 % cols;

  if (
    (Math.abs(row1 - row2) === 1 && col1 === col2) ||
    (row1 === row2 && Math.abs(col1 - col2) === 1)
  ) {
    return true;
  }

  if (row1 === row2) {
    const start = Math.min(col1, col2) + 1;
    const end = Math.max(col1, col2);
    for (let c = start; c < end; c++) {
      const idx = row1 * cols + c;
      if (numbers[idx] !== null) return false;
    }
    return true;
  }

  if (col1 === col2) {
    const start = Math.min(row1, row2) + 1;
    const end = Math.max(row1, row2);
    for (let r = start; r < end; r++) {
      const idx = r * cols + col1;
      if (numbers[idx] !== null) return false;
    }
    return true;
  }

  if (col1 === cols - 1 && col2 === 0 && row2 === row1 + 1) return true;
  if (col2 === cols - 1 && col1 === 0 && row1 === row2 + 1) return true;

  return false;
};

const updateScore = () => {
  const scoreEl = document.getElementById("score");
  scoreEl.textContent = `Score: ${state.score} / ${TARGET_SCORE}`;
};

const checkWin = () => {
  if (state.score >= TARGET_SCORE) {
    stopTimer();
    const status = document.querySelector(".game-status");
    status.textContent = "🎉 You win!";
    status.style.color = "#ffcc00";
    if (localStorage.getItem("musicStartEnd") === "true") {
      playSound(winSound);
    }
  }
};

function checkLose() {
  const rows = Math.ceil(state.numbers.length / COLS);

  // Проверка ограничения сетки
  if (rows >= MAX_ROWS) {
    stopTimer();
    const status = document.querySelector(".game-status");
    status.textContent = "❌ Grid limit reached — You lose!";
    status.style.color = "red";
    if (localStorage.getItem("musicStartEnd") === "true") {
      playSound(winSound);
    }
    return true;
  }

  let movesAvailable = false;
  for (let i = 0; i < state.numbers.length; i++) {
    if (state.numbers[i] === null) continue;
    for (let j = i + 1; j < state.numbers.length; j++) {
      if (state.numbers[j] === null) continue;
      const val1 = state.numbers[i];
      const val2 = state.numbers[j];
      if (canPair(i, j) && (val1 === val2 || val1 + val2 === 10)) {
        movesAvailable = true;
        break;
      }
    }
    if (movesAvailable) break;
  }

  // Добавляем условие: поражение если нет доступных ходов и Add rows = 0
  if (!movesAvailable && state.assistCount === 0) {
    stopTimer();
    const status = document.querySelector(".game-status");
    status.textContent = "❌ No moves left — You lose!";
    status.style.color = "red";
    if (localStorage.getItem("musicStartEnd") === "true") {
      playSound(winSound);
    }
    return true;
  }

  return false;
}

function useAssist() {
  if (state.assistCount <= 0) return;

  const rows = state.numbers.length / COLS;
  if (rows >= MAX_ROWS) {
    lose_GridLimit();
    return;
  }

  if (localStorage.getItem("assistTool") === "true") {
    playSound(assistSound);
  }

  state.assistCount--;

  const newRow = generateNumbers(state.mode);
  state.numbers = state.numbers.concat(newRow);
  reRenderBoard();
  updateAssistBtn();
  saveGame();
  checkLose();

  if (state.numbers.length / COLS >= MAX_ROWS) {
    lose_GridLimit();
    return;
  }
}

function reRenderBoard() {
  const board = document.querySelector(".board");
  board.innerHTML = "";

  board.style.backgroundColor = localStorage["gridColor"] || "#68d073ff";

  state.numbers.forEach((n, idx) => {
    const cell = document.createElement("div");
    cell.className = "cell";
    cell.dataset.index = idx;
    cell.dataset.value = n;
    cell.style.border = `1px solid ${localStorage["uiColor"] || "#0c3e05ff"}`;

    if (n !== null) {
      cell.innerHTML = `<div class="cell-num">${n}</div>`;
    }

    cell.addEventListener("mouseenter", () => {
      if (!cell.classList.contains("selected")) {
        cell.style.backgroundColor =
          localStorage["interactiveColor"] || "#4caf50";
      }
    });

    cell.addEventListener("mouseleave", () => {
      if (!cell.classList.contains("selected")) {
        cell.style.backgroundColor = "#ffffff";
      }
    });

    cell.addEventListener("click", () => handleCellClick(cell));

    board.append(cell);
  });
}

function updateAssistBtn() {
  const btn = document.getElementById("assist-btn");
  if (!btn) return;
  btn.textContent = `Add rows (${state.assistCount})`;
}

function lose_GridLimit() {
  stopTimer();
  const status = document.querySelector(".game-status");
  status.textContent = "❌ Grid limit reached — You lose!";
  status.style.color = "red";
}

const saveGame = () => {
  localStorage.setItem(
    "gameState",
    JSON.stringify({
      numbers: state.numbers,
      score: state.score,
      time: state.time,
      mode: state.mode,
      assistCount: state.assistCount,
    })
  );
};

const loadGame = () => {
  const saved = JSON.parse(localStorage.getItem("gameState"));
  if (saved) {
    state.numbers = saved.numbers;
    state.score = saved.score;
    state.time = saved.time;
    state.mode = saved.mode;
    state.assistCount = saved.assistCount || MAX_ASSISTS;
    createGameLayout(saved.mode);
    updateScore();
    updateAssistBtn();
    startTimer();
  } else {
    startGame("Classic");
  }
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
