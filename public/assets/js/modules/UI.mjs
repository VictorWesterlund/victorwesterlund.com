import { Logging } from "./Logging.mjs";

const interactions = {
	toggleMenu: () => {
		const speed = 200;
		const menu = document.getElementsByTagName("main")[0];
	
		menu.style.setProperty("transition",`${speed}ms`);
		menu.classList.toggle("active");
		setTimeout(() => menu.style.removeProperty("transition"),speed + 1);
	}
}

export class Interaction extends Logging {
	constructor() {
		super();
		this.attribute = "data-action";

		const elements = document.querySelectorAll(`[${this.attribute}]`);
		for(const element of elements) {
			element.addEventListener("click",event => this.clickHandler(event));
		}
	}

	clickHandler(event) {
		const target = event.target.closest(`[${this.attribute}]`);
		const action = target?.getAttribute(this.attribute) ?? null;

		if(!target || !action || !Object.keys(interactions).includes(action)) {
			return false;
		}
		interactions[action]();
	}
}