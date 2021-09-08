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
		this.element.close = () => this.close(); // Bind close to element prototype
		document.body.insertAdjacentElement("afterbegin",this.element);
	}

	// Fetch page html from "assets/pages"
	async getPage(page) {
		const url = `assets/pages/${page}`;
		const response = await fetch(url);
		if(!response.ok) {
			throw new Error(`Modal: Failed to fetch page "${page}"`);
		}
		return response.text();
	}

	insertHTML(element) {
		this.inner.insertAdjacentHTML("afterbegin",element);
	}

	insertElement(element) {
		this.inner.insertAdjacentElement("afterbegin",element);
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
		setTimeout(() => this.element.classList.add("active"),this.transition / 2);
	}

	// Close the modal and remove it from the DOM
	close() {
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

	init(slim) {
		this.element.classList.add("card");
		this.element.classList.add("center");
		const closeButton = new Button({
			text: "close",
			action: "close"
		});

		this.bind(closeButton.element);
		this.inner.appendChild(closeButton.element);
	}

	error(message) {
		const oops = document.createElement("p");
		const infoButton = new Button({
			text: "more info"
		});

		oops.classList.add("error");
		oops.innerText = "🤯\nSomething went wrong";

		infoButton.element.addEventListener("click",() => {
			oops.innerText = "📋\n" + message;
			destroy(infoButton.element);
		});

		this.insertElement(infoButton.element);
		this.insertElement(oops);
	}

	// Open page from "assets/pages"
	openPage(page) {
		// Show a spinner while fetching
		const spinner = document.createElement("div");
		spinner.classList = "logo spinner";
		this.insertElement(spinner);
		this.open();

		// Fetch the requested page
		this.getPage(page).then(html => {
			this.insertHTML(html);
			this.bindAll(this.inner);
		})
		.catch(error => this.error(error))
		.finally(() => destroy(spinner));
	}
}