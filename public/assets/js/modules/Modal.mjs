export default class Modal {
    constructor() {
        this.assetsRoot = "/";

        this.importStyleSheet();
        console.log("post", Symbol.for("modal.style"));
    }

    importStyleSheet() {
        const style = document.createElement("link");
        style.setAttribute("rel", "stylesheet");
        style.setAttribute("href", this.assetsRoot + "css/modal.css");
        
        document.head.appendChild(style);
    }
}