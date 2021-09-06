// Copyright © Victor Westerlund - No libraries! 😲
import { default as Interaction } from "./modules/UI.mjs";
import { default as Debug } from "./modules/Debugging.mjs";

// All default interactions
const interactions = {
	toggleMenu: () => {
		const speed = 200;
		const menu = document.getElementsByTagName("main")[0];
	
		menu.style.setProperty("transition",`${speed}ms`);
		menu.classList.toggle("active");
		setTimeout(() => menu.style.removeProperty("transition"),speed + 1);
	},
	openContactCard: () => {
		const module = import("./modules/Modals.mjs");
		const interactions = {
			hello: () => {
				console.log("Hello world");
			}
		};

		module.then(modals => {
			const card = new modals.Card(interactions);
			card.openPage("contact_card");
		});
	}
}

const theme = window.matchMedia("(prefers-color-scheme: dark)");
const main = new Interaction(interactions,document.body);

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