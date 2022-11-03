// Update timed DOM components
export default class TimeUpdate {
    constructor() {
        this.date = new Date();

        this.myTime();
        this.skyPicture();
        this.skyAge();
    }

	// Set the innerText of an Element by its id
    setTextById(id, text) {
        const element = document.getElementById(id) ?? null;
        if (!element) {
            return false;
        }
    
        element.innerText = text;
    }

	// Set the time in the #intro section (normal clock display)
    myTime() {
        let time = [
            (this.date.getUTCHours() + 2) % 24, // Get hours
            (this.date.getUTCMinutes()) % 60, // Get minutes
        ];

        // Prepend 0 for single-digit numbers
        time = time.map(x => {
            return x < 10 ? "0" + x : x;
        });

        // Concat hour and minutes with semicolon seperator
        this.setTextById("time", time.join(":"));
    }

	// Update the sky picture from endpoint
    skyPicture() {
        const image = document.querySelector("#sky > picture") ?? null;
        if (!image) {
            return false;
        }

        // Helper function to prepare a cache breaking URL
        const taggedUrl = (url) => {
            url = new URL(url);
            // Use current unix epoch as a search param
            url.searchParams.set("t", this.date.valueOf());

            return url.toString();
        }

        // Reload sky picture (using cache breaking URL)
        [...image.children].forEach(child => {
            switch (child.constructor) {
                case HTMLSourceElement:
                    child.srcset = taggedUrl(child.srcset);
                    break;

                case HTMLImageElement:
                    child.src = taggedUrl(child.src);
                    break;
            }
        });
    }

    /* 
     * A new picture of the sky is taken at every 10th minute.
     * So round the age down to the nearest 10 minute mark.
     */
    skyAge() {
        let age = this.date.getMinutes() % 10;

        if (age <= 1) {
            /*
             * It sometimes takes the server a little longer to transcode
             * the picture, so give it an around 1 minute text - for 2 minutes.
             */
            age = "~1 minute"
        } else {
            // Plural suffix
            age += " minutes";
        }

        this.setTextById("sky_age", age);
    }
}