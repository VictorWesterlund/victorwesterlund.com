import { default as Glitch } from "./glitch/Glitch.mjs";

const logging = "https://victorwesterlund-logging-dnzfgzf6za-lz.a.run.app";

// Log link clicks
for(let link of document.getElementsByTagName("a")) {
    link.addEventListener("click", event => {
        event.preventDefault();
        navigator?.sendBeacon(logging, event);
        window.location.href = event.target.href;
    });
}

window.glitch = new Glitch(document.body.parentElement);