// Copyright © Victor Westerlund - No libraries! 😲

import { default as Interaction, destroy } from "./UI.mjs";

// Boilerplate for creating element overlays
class Modal extends Interaction {
	constructor(extendedInteractions = {}) {
		const element = document.createElement("div");
		let interactions = {
			close: () => {
				this.close();
			}
		};
		interactions = Object.assign(interactions,extendedInteractions);
		super(element,interactions);

		this.element = this.applyTemplate(element);
		this.importStyleSheet();
	}

	// Import the companion CSS rules
	importStyleSheet() {
		let sheet = "css/modal.css";
		
		// Import stylesheet with CSS module script if supported
		if(document.adoptedStyleSheets) {
			sheet = "../../" + sheet;
			const module = import(sheet, {
				assert: { type: "css" }
			});
			module.then(style => document.adoptedStyleSheets = [style.default]);
			return;
		}

		// Exit if the stylesheet has already been imported
		if(document.head.querySelector("link[data-async-modalcss]")) {
			return false;
		}

		// Import the stylesheet with a link tag
		sheet = "assets/" + sheet;
		const element = document.createElement("link");
		element.setAttribute("rel","stylesheet");
		element.setAttribute("href",sheet);
		element.setAttribute("data-async-modalcss","");
		document.head.appendChild(element);
	}

	// Apply a modal template to the provided element
	applyTemplate(element) {
		// The inner div will contain modal content
		const inner = document.createElement("div");
		inner.classList.add("inner");
		element.appendChild(inner);
		element.classList.add("modal");

		// PointerEvents on the outer div will close the modal
		element.addEventListener("click",() => this.close());

		return element;
	}

	open() {
		document.body.classList.add("modalActive");
		this.element.classList.add("active");
	}

	// Close the modal and remove it from the DOM
	close() {
		const activeModals = document.getElementsByClassName("modal");
		if(!activeModals || activeModals.length === 1) {
			// Remove active effects if all modals have been closed
			document.body.classList.remove("modalActive");
		}

		this.element.classList.remove("active");
		setTimeout(() => destroy(this.element),this.transition + 1); // Wait for transition
	}
}

// Overlay with a slide-in animation from the bottom of the viewport
export class Card extends Modal {
	constructor(interactions) {
		super(interactions);

		this.transition = 300;
		this.init();
	}

	setContent(content) {
		this.element.insertAdjacentHTML("beforeend",content);
	}

	init() {
		this.element.classList.add("card");
		document.body.appendChild(this.element);
	}

	openPage(page) {
		this.open();
	}
}