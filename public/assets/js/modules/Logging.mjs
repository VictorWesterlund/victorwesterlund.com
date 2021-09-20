// Victor Westerlund - www.victorwesterlund.com

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
			const url = this.endpoint + this.data.toString();
			fetch(url).catch(response => console.log(response));
		}
	}
}

export default class Log {
	constructor(value,key = "u") {
		// WIP
	}
}