import { createScreen } from "./screen.js";

export function createSettings() {
  document.body.innerHTML = "";

  const options = document.createElement("section");
  options.className = "options";
  const optionsWrapper = document.createElement("div");
  optionsWrapper.className = "options__wrapper";
  options.append(optionsWrapper);
  const themeWrapper = document.createElement("div");
  themeWrapper.className = "theme__wrapper";
  const soundWrapper = document.createElement("div");
  soundWrapper.className = "sound__wrapper";
  const themeTitle = document.createElement("h2");
  themeTitle.textContent = "Theme";

  if (localStorage["darkMode"] === "true") {
    document.body.style.backgroundColor = "#222";
    document.body.style.color = "#fff";
  }

  optionsWrapper.append(
    createDarkModeButton(),
    createHalloweenButton(),
    themeWrapper,
    soundWrapper,
    linkToMainPage(),
    getDefault()
  );

  themeWrapper.append(
    themeTitle,
    createTheme("Background color:", "backgroundColor"),
    createTheme("Grid and cell colors:", "gridColor"),
    createTheme("Buttons, counters, text:", "uiColor"),
    createTheme("Interactive elements:", "interactiveColor")
  );

  const soundTitle = document.createElement("h2");
  soundTitle.textContent = "Sound";
  soundWrapper.append(soundTitle, createSound());

  document.body.append(options);
}

const createSound = () => {
  const wrapper = document.createElement("div");
  wrapper.className = "description sound__description";
  createSoundBlock(wrapper, "Game start and end events", "musicStartEnd");
  createSoundBlock(wrapper, "Cell selection/deselection", "cellSelection");
  createSoundBlock(wrapper, "Invalid pair attempts", "invalidPair");
  createSoundBlock(wrapper, "Successful pair matching", "correctPair");
  createSoundBlock(
    wrapper,
    "Assist tool usage (add numbers, shuffle)",
    "assistTool"
  );
  return wrapper;
};

const createSoundBlock = (wrapper, text, field) => {
  const block = document.createElement("div");
  block.className = "sound-item";
  const sound = document.createElement("p");
  sound.textContent = text;
  const musicStartEnd = document.createElement("input");
  musicStartEnd.type = "checkbox";
  musicStartEnd.checked = localStorage.getItem(field) === "true";
  musicStartEnd.addEventListener("change", () => {
    localStorage.setItem(field, musicStartEnd.checked);
  });
  block.append(sound, musicStartEnd);
  wrapper.append(block);
};

const createTheme = (text, field) => {
  const wrapper = document.createElement("div");
  wrapper.className = "description";
  const backgroundColor = document.createElement("p");
  backgroundColor.textContent = text;
  wrapper.append(
    backgroundColor,
    createColor("red", field),
    createColor("blue", field),
    createColor("green", field),
    createColor("yellow", field),
    createColor("purple", field),
    createColor("black", field)
  );
  return wrapper;
};

const createColor = (color, field) => {
  const colorBlock = document.createElement("div");
  colorBlock.style.backgroundColor = color;
  colorBlock.className = "color-block";
  colorBlock.style.width = "20px";
  colorBlock.style.height = "20px";
  colorBlock.style.borderRadius = "50%";
  colorBlock.style.cursor = "pointer";
  colorBlock.style.border = "1px solid white";

  colorBlock.addEventListener("click", () => {
    localStorage[field] = color;
    document.body.style[field] = color;

    if (field === "uiColor") {
      document.body.style.color = color;

      const menu = document.querySelector(".back");
      const def = document.querySelector(".default");
      const darkBtn = document.querySelector(".dark-mode");
      const halloweenBtn = document.querySelector(".halloween-btn");
      if (menu) menu.style.backgroundColor = color;
      if (def) def.style.backgroundColor = color;
      if (darkBtn) darkBtn.style.backgroundColor = color;
      if (halloweenBtn) halloweenBtn.style.backgroundColor = color;
    }
  });

  return colorBlock;
};

const linkToMainPage = () => {
  const menu = document.createElement("button");
  menu.textContent = "Back";
  menu.className = "back";

  const ui = localStorage["uiColor"] || "#4caf50";

  menu.style.backgroundColor = ui;

  menu.addEventListener("mouseenter", () => {
    menu.style.backgroundColor = localStorage["interactiveColor"] || "#87a788";
  });
  menu.addEventListener("mouseleave", () => {
    menu.style.backgroundColor = localStorage["uiColor"] || "#4caf50";
  });

  menu.addEventListener("click", () => {
    document.body.innerHTML = "";
    createScreen();
  });

  return menu;
};

const getDefault = () => {
  const defaultBtn = document.createElement("button");
  defaultBtn.textContent = "Default";
  defaultBtn.className = "default";

  const ui = localStorage["uiColor"] || "#4caf50";

  defaultBtn.style.backgroundColor = ui;

  defaultBtn.addEventListener("click", () => {
    const backBtn = document.querySelector(".back");
    const darkBtn = document.querySelector(".dark-mode");
    const halloweenBtn = document.querySelector(".halloween-btn");
    document.body.style.backgroundColor = "#b4cfad";
    document.body.style.color = "black";
    defaultBtn.style.backgroundColor = "#4caf50";
    backBtn.style.backgroundColor = "#4caf50";
    darkBtn.style.backgroundColor = "#4caf50";
    halloweenBtn.style.backgroundColor = "#4caf50";
    localStorage.clear();

    localStorage.setItem("cellSelection", true);
    localStorage.setItem("musicStartEnd", true);
    localStorage.setItem("invalidPair", true);
    localStorage.setItem("correctPair", true);
    localStorage.setItem("assistTool", true);
  });

  defaultBtn.addEventListener("mouseenter", () => {
    defaultBtn.style.backgroundColor =
      localStorage["interactiveColor"] || "#87a788";
  });
  defaultBtn.addEventListener("mouseleave", () => {
    defaultBtn.style.backgroundColor = localStorage["uiColor"] || "#4caf50";
  });

  return defaultBtn;
};

const createDarkModeButton = () => {
  const darkBtn = document.createElement("button");
  darkBtn.textContent = "Night Mode";
  darkBtn.className = "dark-mode";

  const ui = localStorage["uiColor"] || "#4caf50";

  darkBtn.style.backgroundColor = ui;

  darkBtn.addEventListener("click", () => {
    const body = document.body;
    const isCurrentlyDark = localStorage["darkMode"] === "true";

    if (isCurrentlyDark) {
      body.style.backgroundColor = localStorage["backgroundColor"] || "#ffffff";
      body.style.color = localStorage["uiColor"] || "#000000";
      darkBtn.style.backgroundColor = "#4caf50";
      darkBtn.style.color = "#000";
      localStorage["darkMode"] = "false";
    } else {
      body.style.backgroundColor = "#222";
      body.style.color = "#fff";
      darkBtn.style.backgroundColor = "#333";
      darkBtn.style.color = "#fff";
      localStorage["darkMode"] = "true";
    }
  });

  return darkBtn;
};

const createHalloweenButton = () => {
  const btn = document.createElement("button");
  btn.textContent = "🎃 Halloween Theme";
  btn.className = "halloween-btn";
  const ui = localStorage["uiColor"] || "#4caf50";
  btn.style.backgroundColor = ui;

  if (localStorage["theme"] === "halloween") {
    applyHalloweenTheme();
  }

  btn.addEventListener("click", () => {
    applyHalloweenTheme();
    localStorage["theme"] = "halloween";
  });

  btn.addEventListener("mouseenter", () => {
    btn.style.backgroundColor = localStorage["interactiveColor"] || "#87a788";
  });
  btn.addEventListener("mouseleave", () => {
    btn.style.backgroundColor = localStorage["uiColor"] || "#4caf50";
  });

  return btn;
};

const applyHalloweenTheme = () => {
  document.body.style.backgroundColor = "#1b0a1e";
  document.body.style.color = "#ff8c00";

  const uiColor = "#ff7518";
  const interactive = "#ffa94d";
  localStorage["uiColor"] = uiColor;
  localStorage["interactiveColor"] = interactive;

  localStorage["gridColor"] = "#3b1d3a";
  localStorage["backgroundColor"] = "#1b0a1e";

  document.querySelectorAll("button").forEach((b) => {
    b.style.backgroundColor = uiColor;
    b.style.color = "#000";
  });

  localStorage["darkMode"] = "false";
};
