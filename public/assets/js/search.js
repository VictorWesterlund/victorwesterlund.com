import { default as Search } from "./modules/Search.mjs";

const searchBox = document.getElementById("search")?.children[0] ?? false;
const resultsContainer = document.getElementById("results");

new Search(searchBox,resultsContainer);
window.addEventListener("keydown",() => searchBox.focus());