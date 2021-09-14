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
			},
			openPage: (event) => {
				let modal = undefined;
				switch(event.target.dataset.type) {
					case "card":
						modal = new Card({});
						break;
					case "dialog":
					default:
						modal = new Dialog({});
						break;
				}
				modal.openPage(event.target.dataset.value);
			}
		};
		// Combine template and incoming interactions into one object
		interactions = Object.assign(interactions,extendedInteractions);
		super(interactions,element);

		this.transition = 300;

		this.element = this.applyTemplate(element);
		this.element.close = () => this.close(); // Bind modal close to element prototype
		document.body.insertAdjacentElement("afterbegin",this.element);
	}

	// Fetch page html from "assets/pages"
	async getPage(page) {
		const url = `assets/pages/${page}`;
		const response = await fetch(url);
		if(!response.ok) {
			const report = {
				"self": "Modal.getPage()",
				"self_page": page,
				"resp_status": response.status,
				"resp_statusText": response.statusText,
				"resp_url": response.url,
				"rqst_ua": navigator.userAgent  
			};
			throw new Error(JSON.stringify(report,null,2));
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

	error(message) {
		const oops = document.createElement("p");
		const infoButton = document.createElement("p");

		oops.classList.add("error");
		oops.innerText = "🤯\nSomething went wrong";

		infoButton.innerText = "more info..";
		infoButton.addEventListener("click",() => {
			const details = new Dialog();

			details.insertHTML(`<h1>📄 Error report</h1><pre>${message}</pre>`);
			details.open();

			this.close();
		});

		this.insertElement(infoButton);
		this.insertElement(oops);
	}

	// Open page from "assets/pages"
	openPage(page) {
		// Show a spinner while fetching
		const spinner = document.createElement("div");
		spinner.classList = "logo spinner";
		this.element.setAttribute("data-page",page);
		this.insertElement(spinner);
		this.open();

		// Fetch the requested page
		this.getPage(page).then(html => {
			this.insertHTML(html);
			this.bindAll(this.inner);
		})
		.catch(error => {
			const tryAgain = new Button({
				text: "try again",
				type: "solid"
			});
			tryAgain.element.addEventListener("click",() => {
				// Clear and recreate modal structure
				destroy(this.inner);
				this.applyTemplate(this.element);
				this.init();
				this.insertElement(spinner);
				// Attempt to fetch the requested url again (with soft rate-limiting)
				setTimeout(() => {
					this.openPage(page);
					destroy(spinner);
				},500);
			});
			this.insertElement(tryAgain.element);
			this.error(error);
		})
		.finally(() => destroy(spinner));
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

export class Dialog extends Modal {
	constructor(interactions = {}) {
		super(interactions);
		this.init();
	}

	init() {
		this.element.classList.add("dialog");
		this.element.classList.add("center");
		const closeButton = new Button({
			text: "close",
			action: "close",
			type: "phantom"
		});

		this.bind(closeButton.element);
		this.inner.appendChild(closeButton.element);
	}
}

// Overlay with a slide-in animation from the bottom of the viewport
export class Card extends Modal {
	constructor(interactions = {}) {
		super(interactions);
		this.init();
	}

	init() {
		this.element.classList.add("card");
		this.element.classList.add("center");
		const closeButton = new Button({
			text: "close",
			action: "close",
			type: "phantom"
		});

		this.bind(closeButton.element);
		this.inner.appendChild(closeButton.element);
	}
}