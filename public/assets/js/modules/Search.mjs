export default class Search {
	constructor(input,results) {
		const self = this;

		this.endpoint = new URL("api/search",window.location.href);

		this.lastQuery = "";
		this.timeout = null;

		this.results = {
			element: results,
			set content(html) {
				this.results?.insertAdjacentHTML("beforeend",html);
			}
		};
		input?.addEventListener("keydown",event => this.keyEvent(event)) ?? false;
	}

	async search(query) {
		const url = new URL(this.endpoint);
		url.searchParams.set("q",query);

		const timeout = setTimeout(() => this.showSpinner(),1000);
		const api = await fetch(url);
		
		return result;
	}

	queue(query) {
		clearTimeout(this.timeout);
		this.timeout = setTimeout(() => this.search(query),500);
	}

	async keyEvent(event) {
		if(event.target.value === this.lastQuery) {
			return false;
		}
		this.queue(event.target.value);
	}
}