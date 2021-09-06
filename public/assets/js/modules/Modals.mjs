// Copyright © Victor Westerlund - No libraries! 😲

import { default as Interaction, destroy } from "./UI.mjs";
import { Button } from "./Components.mjs";

// Boilerplate for creating element overlays
class Modal extends Interaction {
	constructor(extendedInteractions = {}) {
		const element = document.createElement("div");
		let interactions = {
			close: () => {
				this.close();
			}
		};
		// Combine template and incoming interactions into one object
		interactions = Object.assign(interactions,extendedInteractions);
		super(interactions,element);

		this.element = this.applyTemplate(element);
		this.importStyleSheet();
		document.body.appendChild(this.element);
	}

	// Import the companion CSS rules
	importStyleSheet() {
		let sheet = "assets/css/modal.css";
		const element = document.createElement("link");

		// Exit if the stylesheet has already been imported
		if(document.head.querySelector("link[data-async-modalcss]")) {
			return false;
		}

		// Import the stylesheet with a link tag
		element.setAttribute("rel","stylesheet");
		element.setAttribute("href",sheet);
		element.setAttribute("data-async-modalcss","");
		document.head.appendChild(element);
	}

	// Apply a modal template to the provided element
	applyTemplate(element) {
		// The inner div will contain modal content
		this.inner = document.createElement("div");
		this.inner.classList.add("inner");
		element.appendChild(this.inner);
		element.classList.add("modal");

		// PointerEvents on the outer div will close the modal
		element.addEventListener("click",event => {
			if(event.target == element) {
				this.close();
			}
		});

		return element;
	}

	open() {
		document.body.classList.add("modalActive");
		setTimeout(() => this.element.classList.add("active"),this.transition / 2);
	}

	// Close the modal and remove it from the DOM
	close() {
		const activeModals = document.getElementsByClassName("modal");
		if(!activeModals || activeModals.length === 1) {
			// Remove active effects if all modals have been closed
			setTimeout(() => document.body.classList.remove("modalActive"),this.transition / 2);
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

	init(slim) {
		this.element.classList.add("card");
		this.element.classList.add("center");
		const closeButton = new Button({
			text: "close",
			action: "close"
		});
		const closeButtonElement = closeButton.getElement();

		this.bind(closeButtonElement);
		this.inner.appendChild(closeButtonElement);
	}

	openPage(page) {
		this.open();
	}
}