export class Dialog {
	constructor(target, options = {}) {
		this.dialog = document.createElement("dialog");

		// Center the dialog modal
		this.setStyle(this.dialog, {
			"margin": "auto",
			"display": "flex",
			"flex-direction": "column",
			"gap": "var(--padding)"
		});

		this.content = document.createElement("div");
		this.content.classList.add("content");

		// Use only as wrapper
		this.setStyle(this.content, {
			"display": "contents"
		});

		// Close modal when open attribute gets removed
		this.observer = new MutationObserver(mutation => {
			if (mutation[0].attributeName === "open") {
				this.closed();
			}
		});

		// HTMLDialogElement is not supported, use an alert() instead
		if (typeof this.dialog.showModal !== "function") {
			this.dialog = {
				title: "",
				content: ""
			}
		}

		// Append header content
		if ("header" in options) {
			this.header(options.header);
		}

		// Bind events and append to DOM
		if (this.dialog instanceof HTMLDialogElement) {
			this.dialog.addEventListener("click", event => {
				const size = event.target.closest("dialog").getBoundingClientRect();
	
				// If click happened on the area surrounding the dialog (lazy dismiss)
				if (event.x < size.left || event.y < size.top || event.x > size.right || event.y > size.bottom) {
					this.close();
				}
			});

			document.body.appendChild(this.dialog);
		}
	}

	setStyle(target, props) {
		// Get element by selector
		if (!target instanceof HTMLElement) {
			target = document.querySelector(target);
		}

		// Set CSS properties
		for (const [name, value] of Object.entries(props)) {
			target.style.setProperty(name, value);
		}
	}

	// Set dialog header
	header(header) {
		// Remove existing header wrapper
		let element = this.dialog.getElementsByClassName("header")[0] ?? null;
		if (element) {
			element.remove();
		}

		const size = "50px";

		// Create header wrapper
		element = document.createElement("div");
		element.classList.add("header");
		this.setStyle(element, {
			"display": "grid",
			"grid-template-columns": `1fr ${size}`,
			"align-items": "center",
			"padding": "var(--padding)",
			"gap": "var(--padding)",
			"background-color": "rgba(var(--primer-color-contrast), .05)"
		});

		// Append a header text
		if ("title" in header) {
			const title = document.createElement("h1");
			title.innerText = header.title;
			this.setStyle(title, {
				"margin-left": "calc(var(--padding) / 2)"
			});

			element.appendChild(title);
		}

		// Append a close button
		if ("closeButton" in header && header.closeButton === true) {
			const closeButton = document.createElement("div");
			closeButton.classList.add("button");
			closeButton.innerHTML = '<svg viewbox="0 0 10 10"><path stroke="var(--color-base)" d="M 0,0 l 10,10 M 0,10 l 10,-10"></path></svg>';
			this.setStyle(closeButton, {
				"width": size,
				"height": size,
				"padding": "calc(var(--padding) / 1.25)"
			});

			closeButton.addEventListener("click", () => this.close());
			element.appendChild(closeButton);
		}

		this.dialog.insertAdjacentElement("afterbegin", element);
	}

	// Remove content element subtree
	clear() {
		if (!this.dialog instanceof HTMLDialogElement || !this.content) {
			return false;
		}

		while (this.content.lastChild) {
			this.content.lastChild.remove();
		}
	}

	error(title = "Something went wrong", message = "Unknown error", data = null) {
		this.header({
			title: title,
			closeButton: true
		});

		this.clear();

		const info = document.createElement("p");
		info.innerText = message;

		this.content.appendChild(info);

		// Has detailed information about error
		if (data) {
			// Create the element which, when clicked, will show data
			const dump = document.createElement("p");
			dump.classList.add("interact");
			dump.innerText = "here for technical data";
			this.setStyle(dump, { "text-decoration": "underline" });

			// Show detailed error data
			dump.addEventListener("click", () => {
				dump.classList.remove("interact");
				dump.innerText = `Returned: "${data}"`;

				this.setStyle(dump, {
					"text-decoration": "initial",
					"background-color": "rgba(var(--primer-color-contrast), .05)",
					"padding": "var(--padding)"
				});
			}, { once: true });

			this.content.appendChild(dump);
		}
	}

	// Open modal with embedded page or text
	open(target) {
		let source;

		// Check if the thing to open is a page or some text
		try {
			source = target instanceof HTMLAnchorElement ? new URL(target.href) : new URL(target);

			// Perform top-level navigation instead if HTMLDialogElement is not supported
			if (!this.dialog instanceof HTMLDialogElement) {
				window.location.href = source.toString();
			}

			this.header({
				title: target.hasAttribute("title") ? target.getAttribute("title") : "",
				closeButton: true
			});

			// Fetch page from URL and inject it into dialog DOM
			this.content.innerHTML = "<p>⌛ Loading...</p>";
			fetch(source)
			.then(res => res.text())
			.then(page => this.content.innerHTML = page);
		} catch {
			// Looks like we're just getting text
			this.content.innerText = target;
		}

		this.dialog.showModal();
		this.dialog.appendChild(this.content);

		this.observer.observe(this.dialog, {
			attributes: true
		});
	}

	// Destroy dialog
	closed() {
		this.observer.disconnect();
		this.dialog.remove();
	}

	// Close dialog
	close() {
		if (!this.dialog instanceof HTMLDialogElement) {
			return false;
		}

		this.dialog.close();
	}
}