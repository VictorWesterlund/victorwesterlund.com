// Copyright © Victor Westerlund - No libraries! 😲

// UI component constructor
class Component {
	constructor(tag) {
		this.element = document.createElement(tag); // Root element
	}

	getElement() {
		return this.element;
	}
}

// ⬇ UI Components ⬇

export class Button extends Component {
	constructor(properties) {
		super("div");
		this.element.classList.add("button");

		this.setText(properties.text);
		this.setAction(properties.action);
	}

	setText(text) {
		const textElement = document.createElement("p");
		textElement.innerText = text;
		this.element.appendChild(textElement);
	}

	setAction(action) {
		this.element.setAttribute("data-action",action);
	}
}