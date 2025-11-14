// import { startGame } from "../game.js";

export function createScreen() {
  document.body.innerHTML = "";

  const app = document.createElement("div");
  app.className = "app";

  app.append(createHeader());
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
