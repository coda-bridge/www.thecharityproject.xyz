class Trans extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({mode: 'open'});
    }

    static get observedAttributes() {
        return ['text'];
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (name === 'text' && oldValue !== newValue) {
            this.checkText();
        }
    }

    connectedCallback() {
        this.checkText();

        window.addEventListener('setLanguage', (e) => {
            this.checkText();
        });
    }

    checkText() {
        const text = this.getAttribute('text');
        const language = window.sessionStorage.getItem("codaLanguage");
        // if (language !== "en") {
            document.documentElement.lang = "en"
            this.shadowRoot.innerHTML = `
    ${text}
`;
//             } else {
//                 document.documentElement.lang = "zh-HK"
//                 this.shadowRoot.innerHTML = `
//     ${transData[text] || text}
// `;
//             }
    }
}

customElements.define('trans-component', Trans);