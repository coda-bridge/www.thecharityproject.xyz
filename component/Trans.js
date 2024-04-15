class Trans extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({mode: 'open'});
    }

    connectedCallback() {
        const text = this.getAttribute('text');
        const that = this;


        function checkText() {
            const language = window.localStorage.getItem("codaLanguage");
            if (language !== "en") {
                that.shadowRoot.innerHTML = transData[text] || text;
            } else {
                that.shadowRoot.innerHTML = text;
            }
        }

        window.addEventListener('setLanguage', function (e) {
            checkText();
        });

        checkText();
    }
}

customElements.define('trans-component', Trans);