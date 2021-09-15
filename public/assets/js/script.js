// Copyright © Victor Westerlund - No libraries! 😲
import { default as Preload } from "./modules/Preload.mjs";
import { default as Interaction, destroy } from "./modules/UI.mjs";
import "./modules/Debugging.mjs";

// Load these assets when the DOM is ready (not needed right away)
new Preload([
	"modules/Modals.mjs",
	"modules/Components.mjs",
	"modal.css"
]);

function updateTheme() {
	const media = window.matchMedia("(prefers-color-scheme: dark)");
	document.body.classList.remove("dark");

	// Force dark theme on all pages
	if(media.matches) {
		document.body.classList.add("dark");
		return;
	}
}

// All default interactions
const interactions = {
	toggleMenu: () => {
		const transition = 200;
		const menu = document.getElementsByTagName("main")[0];
	
		// Animate menu state change
		menu.style.setProperty("transition",`${transition}ms`);
		document.body.classList.toggle("menuActive");
		// Remove transition CSS when finished. Wonky resize effects otherwise
		setTimeout(() => menu.style.removeProperty("transition"),transition + 1);
	},
	newCard: (event) => {
		const module = import("./modules/Modals.mjs");
		const interactions = {
			getContact: (event) => {
				const service = event.target.dataset.value;
				module.then(modals => {
					event.target.closest(".modal").close();
					const card = new modals.Card(interactions);
					card.openPage(service);
				});
			},
			copyText: (event) => {
				event.target.classList.add("copied");
				const copied = document.createElement("p");
				copied.innerText = "copied!";
				event.target.appendChild(copied);
				
				setTimeout(() => {
					event.target.classList.remove("copied");
					destroy(copied);
				},1000);
			}
		};

		module.then(modals => {
			const card = new modals.Card(interactions);
			card.openPage(event.target.dataset.value);
		});
	}
}

// Set the current page theme, and listen for changes
const theme = window.matchMedia("(prefers-color-scheme: dark)");
theme.addEventListener("change",updateTheme);

new Interaction(interactions,document.body);
updateTheme();