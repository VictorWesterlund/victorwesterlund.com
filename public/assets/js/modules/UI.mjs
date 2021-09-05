// Copyright © Victor Westerlund - No libraries! 😲

import { default as Logging } from "./Logging.mjs";

const interactions = {
	toggleMenu: () => {
		const speed = 200;
		const menu = document.getElementsByTagName("main")[0];
	
		menu.style.setProperty("transition",`${speed}ms`);
		menu.classList.toggle("active");
		setTimeout(() => menu.style.removeProperty("transition"),speed + 1);
	},
	openContactCard: () => {
		const module = import("./Modals.mjs");
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

// Remove an element and its subtree
export function destroy(family) {
	while(family.firstChild) {
		family.removeChild(family.lastChild);
	}
	family.parentNode.removeChild(family);
}

// General-purpose scoped event handler
export default class Interaction extends Logging {
	constructor(scope = document.body) {
		super();
		this.attribute = "data-action"; // Target elements with this attribute

		// Bind listeners to the target attribute within the provided scope
		const elements = scope.querySelectorAll(`[${this.attribute}]`);
		for(const element of elements) {
			element.addEventListener("click",event => this.pointerEvent(event));
		}
	}

	// Update the theme-color for Chrome on Android devices
	setThemeColor(color) {
		const meta = document.head.querySelector("meta[name='theme-color']");
		const style = getComputedStyle(document.body);
	
		if(!meta || !color) {
			return false;
		}

		// Dark mode will always use the background color
		if(document.body.classList.contains("dark")) {
			color = "background";
		}
	
		if(color[0] !== "#") {
			// Get CSS variable if color isn't a HEX code
			color = style.getPropertyValue(`--color-${color}`);
			color = color.replaceAll(" ","");
		}
		
		meta.setAttribute("content",color);
	}

	// Handle click/touch interactions
	pointerEvent(event) {
		const target = event.target.closest(`[${this.attribute}]`);
		const action = target?.getAttribute(this.attribute) ?? null;

		if(!target || !action || !Object.keys(interactions).includes(action)) {
			// Exit if the interaction is invalid or action doesn't exist
			return false;
		}
		// Execute the function from the data-action attribute
		interactions[action](event);

		// The button has requested a theme-color change
		if(target.hasAttribute("data-theme-color")) {
			this.setThemeColor(target.getAttribute("data-theme-color"));
		}
	}
}