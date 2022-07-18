// Bind dialog box interaction 
[...document.getElementsByClassName("dialog")].forEach(dialog => {
    dialog.addEventListener("click", () => {
        import("./modules/Dialog.mjs").then(mod => {
            // Initialize dialog with interacted element
            const dialogElement = new mod.Dialog(dialog);

            // Will open data-src
            dialogElement.open();
        });
    });
});

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