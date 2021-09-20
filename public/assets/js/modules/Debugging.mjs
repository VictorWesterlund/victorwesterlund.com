// Copyright © Victor Westerlund - No libraries! 😲

class Debug {
	constructor() {
		console.log("Debug mode is enabled.\nList debug functions by running window._debug.list()");
	}

	list() {
		const functions = [
			"list",
			"toggleMenu",
			"openContactsModal",
			"invalidCard",
			"infiniteLoadingCard"
		];
		console.log("Available functions:",functions.map(f => `window._debug.${f}();`));
	}

	toggleMenu() {
		document.getElementsByClassName("hamburger")[0].click();
	}

	openContactsModal() {
		document.getElementsByClassName("hamburger")[0].click();
		document.querySelector("div[data-action='openContactCard']").click();
	}

	demoCard() {
		const module = import("./Modals.mjs");
		const interactions = {
			hello: () => {
				console.log("Hello world");
			}
		};

		module.then(modals => {
			const card = new modals.Card(interactions);
			card.inner.style.height = "80vh";
			card.inner.insertAdjacentHTML("afterbegin","<p>Hello world</p>");
			card.open();
		});
	}

	invalidCard() {
		const module = import("./Modals.mjs");
		const interactions = {
			hello: () => {
				console.log("Hello world");
			}
		};

		module.then(modals => {
			const card = new modals.Card(interactions);
			card.openPage("invalid_card");
		});
	}

	infiniteLoadingCard() {
		const module = import("./Modals.mjs");
		const spinner = document.createElement("div");
		spinner.classList = "logo spinner";

		module.then(modals => {
			const card = new modals.Card(new Object());
			card.insertElement(spinner);
			card.open();
		});
	}
}

export default window._debug = new Debug();