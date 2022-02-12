export default class Glitch {
	constructor(image, target) {
		this.image = image;
		this.target = target ? target : document.body;

		this.interval = {
			_this: this,
			_interval: null,
			// Queue the next glitch
			set next (timeout) {
				clearTimeout(this._interval);
				this._interval = setTimeout(() => this._this.glitch(), timeout);
			}
		}

		this.interval.next = 2000;
		this.setBackground();
	}

	// Update the target CSS background
	setBackground(image = this.image) {
		this.target.style.setProperty("background-image", `url(${image})`);
	}

	// Generate random string of length from charset
	randomString(length = 2) {
		const charset = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
		let output = "";
		for(let i = 0; i < length; i++) {
			output += charset.charAt(Math.floor(Math.random() * charset.length));
		}
		return output;
	}

	// Genrate random int in range
	randomInt(min, max) {
		return Math.random() * (max - min) + min;
	}

	// Create a glitchy image
	glitch() {
		const glitched = this.image.replaceAll(this.randomString(), this.randomString());
		this.setBackground(glitched);

		this.interval.next = this.randomInt(100, 1500);
	}
}