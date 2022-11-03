import TimeUpdate from "./modules/TimeUpdate.mjs";

// Create AudioPlayers from template on interaction
[...document.getElementsByClassName("player")].forEach(player => {
    player.addEventListener("click", () => {
        import("./modules/Player.mjs").then(mod => {
            // Initialize AudioPlayer from template
            const audioPlayer = new mod.AudioPlayer(player);
            let animation;

            // Animate a progress bar as media is playing
            audioPlayer.addEventListener("playing", () => {
                const color = "rgba(var(--primer-color-contrast), .1)";

                const keyframes = [
                    { boxShadow: `inset 0 0 0 0 ${color}` },
                    { boxShadow: `inset ${player.offsetWidth}px 0 0 0 ${color}` }
                ];

                const timing = {
                    duration: 38000, // Robot36 TX + calibration header
                    iterations: 1
                }

                animation = player.animate(keyframes, timing);
                player.querySelector(".playstate").innerText = "stop";
            });

            // Stop animation if playback is interrupted
            audioPlayer.addEventListener("pause", () => {
                animation.cancel();
                player.querySelector(".playstate").innerText = "play";
            });
        });
    }, { once: true });
});

// Log button clicks
[...document.getElementsByClassName("button")].forEach(button => {
    if ("sendBeacon" in navigator) {
        // Get endpoint from dns-prefetch tag
        const endpoint = document.querySelector('[data-id="logging"]').href;
        button.addEventListener("click", event => navigator.sendBeacon(endpoint, event));
    }
})

// Get coffee stats from endpoint
{
    // Get endpoint from preconnect tag
    const endpoint = new URL(document.querySelector('[data-id="coffee"]').href);
    
    fetch(endpoint)
    .then(res => res.json())
    .then(json => {
        const values = json.Values.flat(1);
        const targets = [...document.getElementsByClassName("coffee")];

        // Assign each value in order of appearance
        values.forEach((value, idx) => {targets[idx].innerText = value});
    });
}

// Update timed DOM components every absolute 10th minute
{
    const now = (new TimeUpdate()).date.valueOf();

    const coeff = 1000 * 60;
    const next = Math.ceil((now / coeff)) * coeff;
    const offset = next - now;
    
    // Update timed elements at (roughly) every 10th minute in each absolute hour
    window._timeUpdate = setTimeout(() => {
        window._timeUpdate = setInterval(() => new TimeUpdate(), 60000);
    }, offset);
}