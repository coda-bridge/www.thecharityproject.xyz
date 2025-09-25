class ChangeLanguage extends HTMLElement {
    constructor() {
        super();
        this.language = window.sessionStorage.getItem("codaLanguage");
        this.attachShadow({mode: 'open'});
    }

    render () {
        this.shadowRoot.innerHTML = `
    <style>
        #body {
            z-index: 50;
            background-color: white;
            display: flex;
            align-items: center;
            position: absolute;
            right: 2rem;
            top: 3rem;
            border-radius: 1.5rem;
            border: 1px solid var(--base-green);
            padding: 0.4rem 0.1rem;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        #ball {
            position: absolute;
            background-color: var(--base-green);
            border: 1px solid white;
            height: 1.5rem;
            width: 1.5rem;
            border-radius: 50%;
            transition: all 0.3s ease;
        }
        #en, #hk {
            white-space: nowrap;
            user-select: none;
            width: 1.7rem;
            text-align: center;
            font-size: 0.9rem;
            color: #555;
        }
    </style>
    <div id="body">
        <div id="ball" style="${this.language === "en" ? 'right:0.3rem' : 'left: 0.3rem;'};"></div>
        <div id="en">en</div>
        <div id="hk">hk</div>
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