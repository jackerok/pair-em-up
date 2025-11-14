import { createSettings } from "./settings.js";

export function createScreen() {
  document.body.innerHTML = "";

  const app = document.createElement("div");
  app.className = "app";

  const buttons = {};

  app.append(
    createHeader(),
    createModeSelection(buttons),
    createFooter(buttons)
  );

  document.body.append(app);
  applySettings(buttons);
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

const createModeSelection = (buttons) => {
  const section = document.createElement("section");
  section.className = "mode-selection";

  ["Classic", "Random", "Chaotic"].forEach((mode) => {
    const btn = createButton(mode, "btn");
    section.append(btn);
    buttons[mode.toLowerCase()] = btn;
  });

  return section;
};

const createFooter = (buttons) => {
  const footer = document.createElement("footer");
  footer.className = "footer";

  buttons.setting = createButton("Setting", "btn setting", () =>
    createSettings()
  );
  buttons.continue = createButton("Continue Game", "btn continue");
  buttons.results = createButton("Results", "btn results");

  footer.append(buttons.setting, buttons.continue, buttons.results);
  return footer;
};

const createButton = (text, className, onClick) => {
  const btn = document.createElement("button");
  btn.textContent = text;
  btn.className = className;
  if (onClick) btn.addEventListener("click", onClick);
  return btn;
};

const applySettings = (buttons) => {
  const darkMode = localStorage["darkMode"] === "true";

  const backgroundColor = darkMode
    ? "#222"
    : localStorage["backgroundColor"] || "#b4cfad";
  const textColor = darkMode ? "#fff" : localStorage["uiColor"] || "black";
  const btnColor = localStorage["uiColor"] || "#4caf50";
  const hoverColor = localStorage["interactiveColor"] || "#87a788";

  document.body.style.backgroundColor = backgroundColor;
  document.body.style.color = textColor;

  Object.values(buttons).forEach((btn) => {
    btn.style.backgroundColor = btnColor;
    btn.addEventListener(
      "mouseenter",
      () => (btn.style.backgroundColor = hoverColor)
    );
    btn.addEventListener(
      "mouseleave",
      () => (btn.style.backgroundColor = btnColor)
    );
  });
};
