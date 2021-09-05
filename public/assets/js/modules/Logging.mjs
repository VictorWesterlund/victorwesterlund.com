// Copyright © Victor Westerlund - No libraries! 😲

class Logging {
	constructor() {
		this.endpoint = "/log/";
		this.data = new URLSearchParams();

		document.addEventListener("visibilitychange",() => {
			if(document.visibilityState === "hidden") {
				this.send();
			}
		});

		this.log("foo","bar");
	}

	log(key,value) {
		this.data.append(key,value);
	}

	send() {
		const send = navigator.sendBeacon(this.endpoint,this.data);
		if(send !== true) {
			this.log("mode","fallback");
			const url = this.endpoint + this.data.toString();
			fetch(url).catch(response => console.log(response));
		}
	}
}

export default class Log {
	constructor(value,key = "u") {
		console.log(key,value);
	}
}