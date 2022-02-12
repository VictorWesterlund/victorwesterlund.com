export default class Background {
	constructor(target) {
		this.images = {
			dir: "assets/media/b64/",
			count: 2
		}

		this.image = null;
		this.target = target ? target : document.body;

		this.updateBg = setInterval(() => this.randBg(), 2000);
	}

	// Update the target CSS background
	setBg(image = this.image) {
		this.target.style.setProperty("background-image", `url(${image})`);
	}

	// Genrate random int in range
	randInt(min, max) {
		return Math.round(Math.random() * (max - min) + min);
	}

	// Fetch a base64 encoded background image
	async fetchBg(id) {
		const url = new URL(window.location);

		url.pathname += this.images.dir;
		url.pathname += id + ".txt";

		const image = await fetch(url);
		if(!image.ok) throw new Error("Failed to fetch background image");

		return image.text();
	}

	// Load a random background from the image set
	async randBg() {
		const id = this.randInt(1, this.images.count);
		const image = await this.fetchBg(id);

		this.image = image;
		this.setBg(image);
	}
}