// Victor Westerlund - www.victorwesterlund.com

// UI component constructor
class Component {
	constructor(tag) {
		this.element = document.createElement(tag); // Root element
	}
}

// ⬇ UI Components ⬇

export class Button extends Component {
	constructor(properties) {
		super("div");
		this.properties = properties;
		this.element.classList.add("button");

		this.setText();
		this.setAction();
		this.setType();
	}

	setText() {
		if(!this.properties.text) {
			return false;
		}
		const textElement = document.createElement("p");
		textElement.innerText = this.properties.text;
		this.element.appendChild(textElement);
	}

	setAction() {
		if(!this.properties.action) {
			return false;
		}
		this.element.setAttribute("data-action",this.properties.action);
	}

	setType() {
		const types = [
			"solid",
			"phantom"
		];
		const type = types.includes(this.properties.type) ? this.properties.type : false;

		if(!this.properties.type || !type) {
			return false;
		}
		this.element.classList.add(type);
	}
}