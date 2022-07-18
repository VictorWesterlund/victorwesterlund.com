export class Dialog {
	constructor(target) {
		this.dialog = document.createElement("dialog");

		if (typeof this.dialog.showModal !== "function") {
			throw new Error("Browser does not support HTMLDialogElement");
		}

		document.body.appendChild(this.dialog);
	}

	open() {
		this.dialog.showModal();
	}
}