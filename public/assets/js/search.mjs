import { default as Search } from "./modules/Search.mjs";

const searchBox = document.getElementById("search")?.getElementsByTagName("input")[0] ?? false;
const resultsContainer = document.getElementById("results");

new Search(searchBox,resultsContainer);

// Set focus on searchbox when typing from anywhere
window.addEventListener("keydown",() => searchBox.focus());