// Copyright © Victor Westerlund - No libraries! 😲

class Debug {
	constructor() {
		console.log("Debug mode is enabled.\nList debug functions by running window._debug.list()");
	}

	list() {
		const functions = [
			"list",
			"openContactsModal"
		];
		console.log("Available functions:",functions.map(f => `window._debug.${f}();`));
	}

	openContactsModal() {
		document.getElementsByClassName("hamburger")[0].click();
		document.querySelector("div[data-action='openContactCard']").click();
	}
}

export default window._debug = new Debug();