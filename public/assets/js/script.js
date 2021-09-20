// Victor Westerlund - www.victorwesterlund.com
import { default as Preload } from "./modules/Preload.mjs";
import { default as Interaction, destroy } from "./modules/UI.mjs";

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
	// Open page defined with data-value as a card
	newCard: (event) => {
		const module = import("./modules/Modals.mjs");
		const interactions = {
			// Like newCard() except it closes the previous card
			getContact: (event) => {
				const service = event.target.dataset.value;
				module.then(modals => {
					event.target.closest(".modal").close();
					const card = new modals.Card(interactions);
					card.openPage(service);
				});
			},
			// Copy text defined in data-value to clipboard and play animation
			copyText: (event) => {
				const copy = navigator.clipboard.writeText(event.target.dataset.value);
				copy.then(() => {
					event.target.classList.add("copied");
					const copied = document.createElement("p");
					copied.innerText = "copied!";
					event.target.appendChild(copied);
					
					// Reset button state
					setTimeout(() => {
						event.target.classList.remove("copied");
						destroy(copied);
					},1000);
				});
			}
		};

		// Create card and open the specified page asynchronously
		module.then(modals => {
			const card = new modals.Card(interactions);
			card.openPage(event.target.dataset.value);
		});
	}
}

navigator.serviceWorker.getRegistrations().then(serviceWorkers => {
	for(const serviceWorker of serviceWorkers) {
		serviceWorker.unregister();
	} 
});

// Set the current page theme, and listen for changes
const theme = window.matchMedia("(prefers-color-scheme: dark)");
theme.addEventListener("change",updateTheme);

new Interaction(interactions,document.body); // Initialize default interactions
updateTheme();
