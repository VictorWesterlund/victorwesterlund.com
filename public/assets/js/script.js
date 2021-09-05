// Copyright © Victor Westerlund - No libraries! 😲
import { default as Interaction } from "./modules/UI.mjs";

const theme = window.matchMedia("(prefers-color-scheme: dark)");
const main = new Interaction();

function updateTheme() {
	const media = window.matchMedia("(prefers-color-scheme: dark)");
	document.body.classList.remove("dark");

	// Force dark theme on all pages
	if(media.matches) {
		document.body.classList.add("dark");
		return;
	}
	
	main.setThemeColor("background");
}

// Set the current page theme, and listen for changes
theme.addEventListener("change",updateTheme);
updateTheme();