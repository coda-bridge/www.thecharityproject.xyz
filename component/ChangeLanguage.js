class ChangeLanguage extends HTMLElement {
    constructor() {
        super();
        this.language = window.sessionStorage.getItem("codaLanguage");
        this.attachShadow({mode: 'open'});
    }

    render () {
        this.shadowRoot.innerHTML = `<div id="body" style="z-index: 50;background-color: white;display: flex;align-items: center;position: absolute;right: 1rem;top:1rem;border-radius: 1.05rem;border: 1px solid black;padding:0.3rem;line-height: 1.5rem;height: 1.5rem;">
            <div id="ball" style="position: absolute;background-color: white;${this.language === "en"? 'right:0.3rem' : ''};border: 1px solid black;height: 1.5rem;width: 1.5rem;border-radius: 0.75rem;"></div>
            <div id="en" style="white-space: nowrap;user-select: none;width: 1.7rem;text-align: center;">en</div>
            <div id="hk" style="white-space: nowrap;user-select: none;width: 1.7rem;text-align: center;">hk</div>
        </div>`
    }

    connectedCallback() {
        this.render();
        const that = this;
        const clBody = this.shadowRoot.getElementById("body");
        const ball = this.shadowRoot.getElementById("ball");
        const en = this.shadowRoot.getElementById("en");
        const hk = this.shadowRoot.getElementById("hk");

        function setSessionStorage (key,value) {
            sessionStorage.setItem(key,value);
            const setLanguage = new Event("setLanguage");
            setLanguage.setValue = {key,value};
            window.dispatchEvent(setLanguage);
        }
        function cl() {
            if(that.language === "en") {
                ball.style.removeProperty('right');
                ball.style.left = "0.3rem";
                document.documentElement.lang = "zh-HK"
                setSessionStorage("codaLanguage","hk");
                en.style.visibility = "hidden";
                hk.style.visibility = "visible";
                that.language = "hk";
            } else {
                ball.style.removeProperty('left');
                ball.style.right = "0.3rem";
                document.documentElement.lang = "en"
                setSessionStorage("codaLanguage","en");
                en.style.visibility = "visible";
                hk.style.visibility = "hidden";
                that.language = "en";
            }
        }

        clBody.addEventListener("click",cl)
    }
}

customElements.define('change-language-component', ChangeLanguage);