export default class Search {
	constructor(input,results) {
		const self = this;

		this.endpoint = new URL("api/search",window.location.href);

		this.lastQuery = "";
		this.throttle = null;
		this.controller = null; // AbortController will be assigned here

		this.results = results;
		this.input = input;
		this.input?.addEventListener("keyup",event => this.keyEvent(event)) ?? false;
	}

	// Destroy the result DOM tree
	clearResults() {
		while(this.results.firstChild) {
			this.results.removeChild(this.results.lastChild);
		}
	}

	// Display output as HTML
	output(html) {
		this.clearResults();
		if(typeof html === "string") {
			this.results.insertAdjacentHTML("beforeEnd",html);
			return;
		}
		this.results.appendChild(html);
	}

	// Display a status message in a paragraph
	status(text,classList = false) {
		const element = document.createElement("p");
		if(classList !== false) {
			element.classList = classList;
		}

		element.innerText = text;
		this.output(element);
	}

	// Fetch search results from endpoint
	async search(query) {
		const url = new URL(this.endpoint);
		url.searchParams.set("q",query);

		const timeout = new Promise(reject => setTimeout(() => reject("Request timed out"),3000));
		// Fetch response from server
		const api = fetch(url,{
			signal: this.controller.signal,
			headers: {
				"Content-Type": "text/html"
			}
		});

		const result = Promise.race([api,timeout]);
		result.then(response => {
			if(!response.ok) {
				this.status("oh no, something went wrong","error");
				throw new Error("Invalid response from server");
			}
			return response.text();
		})
		.then(html => this.output(html))
		.catch(error => {});
	}

	// Wait until the user stops typing for a few miliseconds
	queue(query) {
		clearTimeout(this.throttle);
		this.controller = new AbortController(); // Spawn a new AbortController for each fetch
		this.throttle = setTimeout(() => this.search(query),500);
	}

	keyEvent(event) {
		const query = event.target.value;
		// Don't do the search thing if query is too weak
		if(query.length < 1) {
			this.controller.abort(); // Abort queued search
			this.lastQuery = "";
			this.status("search results will appear here as you type");
			return;
		}

		// Pressing a modifier key (Ctrl, Shift etc.) doesn't change the query
		if(query === this.lastQuery) {
			return false;
		}

		this.lastQuery = query;
		this.status("searching..");
		this.queue(query);
	}
}