// Register SW if supported by browser
if(navigator.serviceWorker) {
	navigator.serviceWorker.register("sw.js",{
		scope: "/"
	});
}

const theme = window.matchMedia("(prefers-color-scheme: dark)");

// Set theme color
function updateTheme() {
	// Get theme color from stylesheet
	const color = window.getComputedStyle(document.body).getPropertyValue("--color-background");
	document.querySelector("meta[name='theme-color']").setAttribute("content",color);
}

// Set theme color and listen for changes
theme.addEventListener("change",updateTheme);
updateTheme(theme);
