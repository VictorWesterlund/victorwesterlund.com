import { default as Search } from "./modules/Search.mjs";
// import { default as Monkey } from "./modules/monkeydo/Monkeydo.mjs";

const searchField = document.getElementById("search");
const resultsContainer = document.getElementById("results");

const search = new Search(searchField,resultsContainer);
window.addEventListener("keydown",() => searchField.focus());

/* const monkey = new Monkey({
	keyPress: (key) => searchField.dispatchEvent(new KeyboardEvent("keydown",{"key":key})),
	log: (message) => console.log(message)
});

monkey.load(JSON.stringify({
	tasks: [
		[200,"log","hello friend"],
		[200,"keyPress","h"],
		[400,"keyPress","e"],
		[100,"keyPress","l"],
		[500,"keyPress","l"],
		[700,"keyPress","o"]
	]
})).then(() => monkey.do());
*/