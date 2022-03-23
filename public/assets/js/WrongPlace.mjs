export default class WrongPlace {
	constructor(target) {
		const interval = 2000;

		this.target = target;
		this.populate();
		
		this.anim = setInterval(() => this.generate(), interval);
		this.generate();
	}

	populate() {
		const y = 30;
		const x = 27;

		// Add vertical paragraphs and horizontal spans, man
		for (let i = 0; i <= y; i++) {
			const p = document.createElement("p");
			for (let j = 0; j <= x; j++) {
				const span = document.createElement("span");
				p.appendChild(span);
			}
			this.target.appendChild(p);
		}
	}

	// Get a random number, man
	rand() {
		const clamp = [0, 100]
		return Math.floor(Math.random() * (clamp[1] - clamp[0] + 1) + clamp[0]);
	}

	// Generate a new random background, man
	generate() {
		const spans = this.target.getElementsByTagName("span");

		for (const span of spans) {
			span.innerText = this.rand();
		}
	}
}