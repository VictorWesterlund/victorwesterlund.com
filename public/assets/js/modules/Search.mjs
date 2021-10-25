export default class Search {
	constructor(input,results) {
		const self = this;

		this.endpoint = new URL("api/search",window.location.href);

		this.lastQuery = "";
		this.throttle = null;

		this.results = results;
		this.input = input;
		this.input?.addEventListener("keyup",event => this.keyEvent(event)) ?? false;
	}

	clearResults() {
		while(this.results.firstChild) {
			this.results.removeChild(this.results.lastChild);
		}
	}

	output(html) {
		this.clearResults();
		if(typeof html === "string") {
			this.results.insertAdjacentHTML("beforeEnd",html);
			return;
		}
		this.results.appendChild(html);
	}

	status(text,classList = false) {
		const element = document.createElement("p");
		if(classList !== false) {
			element.classList = classList;
		}

		element.innerText = text;
		this.output(element);
	}

	async search(query) {
		const url = new URL(this.endpoint);
		url.searchParams.set("q",query);

		const timeout = new Promise(reject => setTimeout(() => reject("Request timed out"),3000));
		const api = fetch(url,{
			headers: {
				"Content-Type": "text/html"
			}
		});

		const result = Promise.race([api,timeout]);
		result.then(response => {
			if(!response.ok) {
				console.error("Response from server:",response);
				throw new Error("Invalid response from server");
			}
			return response.text();
		})
		.then(html => this.output(html))
		.catch(error => this.status(error,"error"));
	}

	// Wait until the user stops typing for a few miliseconds
	queue(query) {
		clearTimeout(this.throttle);
		this.throttle = setTimeout(() => this.search(query),500);
	}

	keyEvent(event) {
		const query = event.target.value;
		if(query.length < 1) {
			this.lastQuery = "";
			this.status("search results will appear here as you type");
			return;
		}

		if(query === this.lastQuery) {
			return false;
		}

		this.lastQuery = query;
		this.status("searching..");
		this.queue(query);
	}
}