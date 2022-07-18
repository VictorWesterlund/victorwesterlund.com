// Create a new AudioPlayer from template
export class AudioPlayer extends Audio {
	constructor(target) {
		if (!target instanceof HTMLElement) {
			throw new Error("Target must be an HTMLElement");
		}

		const src = "src" in target.dataset ? target.dataset.src : "";
		super(src);

		// Bind interaction with the player as play/stop
		target.addEventListener("click", () => this.playState());

		// Start playback when ready
		this.addEventListener("canplaythrough", () => this.play(), { once: true });
		// Restart playback if paused (treat as stop)
		this.addEventListener("pause", () => this.currentTime = 0);
	}

	// Play or stop media
	playState() {
		// Ignore if media is still buffering
		if (this.readyState !== HTMLMediaElement.HAVE_ENOUGH_DATA) {
			return false;
		}

		// Stop media if playing
		if (this.paused === false && this.ended === false) {
			this.pause();
			this.currentTime = 0;
			return false;
		}
		
		// Play media
		return this.play();
	}
}