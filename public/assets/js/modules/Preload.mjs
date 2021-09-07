// Copyright © Victor Westerlund - No libraries! 😲

// Load assets for later use on this page.
// This implements a hybrid of the link types "preload" and "prefetch"
export default class Preload {
	constructor(assets) {
		this.scripts = [];
		this.stylesheets = [];

		// Get the type of asset from the file extension
		assets.forEach(asset => {
			const components = asset.split(".");
			const extension = components[components.length - 1];
			switch(extension) {
				case "mjs":
					this.scripts.push(asset);
					break;
				case "css":
					this.stylesheets.push(asset);
					break;
			}
		});

		// Append tags when DOM is ready
		window.addEventListener("DOMContentLoaded",() => this.import());
	}

	import() {
		this.scripts.forEach(script => {
			const element = document.createElement("script");
			element.setAttribute("type","module");
			element.src = "assets/js/" + script;
			document.body.appendChild(element);
		});
		this.stylesheets.forEach(sheet => {
			const element = document.createElement("link");
			element.setAttribute("rel","stylesheet");
			element.href = "assets/css/" + sheet;
			document.head.appendChild(element);
		});
	}
}