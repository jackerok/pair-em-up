// import { startGame } from "../game.js";

export function createScreen() {
  document.body.innerHTML = "";

  const app = document.createElement("div");
  app.className = "app";

  app.append(createHeader(), createModeSelection(), createFooter());
  document.body.append(app);
}

const createHeader = () => {
  const header = document.createElement("header");
  header.className = "header";
  const title = document.createElement("h1");
  title.textContent = "Pair 'Em Up";
  const author = document.createElement("a");
  author.href = "https://github.com/jackerok";
  author.textContent = "Author: jackerok";
  author.target = "_blank";
  author.className = "header__author";
  header.append(title, author);

  return header;
};

const createModeSelection = () => {
  const controls = document.createElement("section");
  controls.className = "mode-selection";

  const settingBtn = document.createElement("button");
  settingBtn.textContent = "Setting";
  settingBtn.className = "btn setting";

  const classicBtn = document.createElement("button");
  classicBtn.textContent = "Classic";
  classicBtn.className = "btn";
  // classicBtn.addEventListener("click", () => startGame("classic"));

  const randomBtn = document.createElement("button");
  randomBtn.textContent = "Random";
  randomBtn.className = "btn";
  // randomBtn.addEventListener("click", () => startGame("random"));

  const chaoticBtn = document.createElement("button");
  chaoticBtn.textContent = "Chaotic";
  chaoticBtn.className = "btn";
  // chaoticBtn.addEventListener("click", () => startGame("chaotic"));

  controls.append(classicBtn, randomBtn, chaoticBtn);

  return controls;
};

const createFooter = () => {
  const footer = document.createElement("footer");
  footer.className = "footer";

  const settingBtn = document.createElement("button");
  settingBtn.textContent = "Setting";
  settingBtn.className = "btn setting";

  const continueBtn = document.createElement("button");
  continueBtn.textContent = "Continue Game";
  continueBtn.className = "btn continue";

  const resultsBtn = document.createElement("button");
  resultsBtn.textContent = "Results";
  resultsBtn.className = "btn results";

  footer.append(settingBtn, continueBtn, resultsBtn);

  return footer;
};
