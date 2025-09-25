class Trans extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({mode: 'open'});
    }

    connectedCallback() {
        const text = this.getAttribute('text');
        const that = this;


        function checkText() {
            const language = window.sessionStorage.getItem("codaLanguage");
            if (language !== "en") {
                document.documentElement.lang = "zh-HK"
                that.shadowRoot.innerHTML = `
    <style>
        :host {
            font-size: 1rem;
            color: #333;
        }
    </style>
    ${transData[text] || text}
`;
            } else {
                document.documentElement.lang = "en"
                that.shadowRoot.innerHTML = `
    <style>
        :host {
            font-size: 1rem;
            color: #333;
        }
    </style>
    ${text}
`;
            }
        }

        window.addEventListener('setLanguage', function (e) {
            checkText();
        });

        checkText();
    }
}

customElements.define('trans-component', Trans);