import { default as Background } from "./Background.mjs";

export default class Glitch extends Background {
	constructor(target) {
		super(target);

		this.interval = {
			_this: this,
			_interval: null,
			// Queue the next glitch
			set next (timeout) {
				clearTimeout(this._interval);
				if(timeout !== false) this._interval = setTimeout(() => this._this.glitch(), timeout);
			}
		}

		// Stop playback when page is not visible
		document.addEventListener("visibilitychange",() => {
			if(document.visibilityState === "visible") return this.start();
			this.stop();
		});

		this.start();
	}

	// Generate random string of length from charset
	randStr(length = 2) {
		const charset = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
		let output = "";
		for(let i = 0; i < length; i++) {
			output += charset.charAt(Math.floor(Math.random() * charset.length));
		}
		return output;
	}

	// Create a glitchy image and queue the next one
	glitch() {
		if(!this.image) return;
		const image = this.image.replaceAll(this.randStr(), this.randStr());
		this.setBg(image);
		
		this.interval.next = this.randInt(1500, 5000);
	}

	start() {
		this.interval.next = 500;
		this.updateBg.running = true;
		this.randBg();
	}

	stop() {
		this.interval.next = false;
		this.updateBg.running = false;
	}
}