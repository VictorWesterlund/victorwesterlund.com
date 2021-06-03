// Register SW if supported by browser
if(navigator.serviceWorker) {
	navigator.serviceWorker.register("sw.js",{
		scope: "/"
	});
}
