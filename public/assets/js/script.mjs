import { default as Glitch } from "./modules/Glitch.mjs";

const logging = "https://victorwesterlund-logging-dnzfgzf6za-lz.a.run.app";

async function openModal(name) {
    const module = await import("./modules/Modal.mjs");
    if(!module) {
        alert("Failed to import module.");
        return;
    }

    const modal = new module.default();
    modal.assetsRoot = window.location.href;
}

// Bind click listerners to all links
for(let link of document.getElementsByTagName("a")) {
    link.addEventListener("click", event => {
        event.preventDefault();
        navigator?.sendBeacon(logging, event); // Log link click

        // Treat tag without func data attribute as a normal link
        if(!"func" in event.target.dataset) window.location.href = event.target.href;

        openModal(event.target.getAttribute("href"));
    });
}

new Glitch(document.body);