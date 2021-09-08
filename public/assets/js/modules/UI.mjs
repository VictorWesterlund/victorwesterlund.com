// Copyright © Victor Westerlund - No libraries! 😲

import { default as Logging } from "./Logging.mjs";

// Remove an element and its subtree
export function destroy(family) {
	while(family.firstChild) {
		family.removeChild(family.lastChild);
	}
	family.parentNode.removeChild(family);
}

// General-purpose scoped event handler
export default class Interaction extends Logging {
	constructor(interactions,scope) {
		super();
		this.interactions = interactions;
		this.attribute = "data-action"; // Target elements with this attribute

		this.bindAll(scope);
	}

	// Bind event listeners to this element
	bind(element) {
		if(element.hasAttribute("data-bound") || !element.hasAttribute(this.attribute)) {
			return false;
		}
		element.addEventListener("click",event => this.pointerEvent(event));
		element.setAttribute("data-bound","");
	}

	// Get all elements with the target attribute in scope
	getAll(scope) {
		return scope.querySelectorAll(`[${this.attribute}]`);
	}

	// Bind listeners to all attributed elements within scope
	bindAll(scope) {
		const elements = this.getAll(scope);
		for(const element of elements) {
			this.bind(element);
		}
	}

	// Set the page theme color (and the theme-color meta tag)
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
		
		document.body.style.setProperty("background-color",color);
		meta.setAttribute("content",color);
	}

	// Handle click/touch interactions
	pointerEvent(event) {
		const target = event.target.closest(`[${this.attribute}]`);
		const action = target?.getAttribute(this.attribute) ?? null;

		if(!target || !action || !Object.keys(this.interactions).includes(action)) {
			// Exit if the interaction is invalid or action doesn't exist
			return false;
		}
		// Execute the function from the data-action attribute
		this.interactions[action](event);

		// The button has requested a theme-color change
		if(target.hasAttribute("data-theme-color")) {
			this.setThemeColor(target.getAttribute("data-theme-color"));
		}
	}
}