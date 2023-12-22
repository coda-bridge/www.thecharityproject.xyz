class TransactionTab extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({mode: 'open'});
    }

    render() {
        function formatDate(timestamp) {
            const date = new Date(timestamp * 1000);
            return date.toLocaleString('en', {
                // year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit'
            });
        }

        this.shadowRoot.innerHTML = `
            <div style="display:flex;align-items: center;justify-content: space-between;margin-bottom: 1.1rem">
                <div id="left-part" style="display: flex;align-items: center;">
                    <div>${this.name}</div>
                </div>
                <div style="text-align: center">
                    <div style="color: var(--base-green);font-weight: 700;">-${this.price} SCT</div>
                    <div style="font-size: 0.7rem">${formatDate(this.time)}</div>
                </div>
            </div>
        `
    }

    connectedCallback() {
        this.render()
        const imgDom = document.createElement('div');

        if (this.img) {
            imgDom.style.backgroundColor = "#D9D9D9"
            imgDom.style.width = "4rem"
            imgDom.style.height = "4rem"
            imgDom.style.borderRadius = "2rem"
            imgDom.style.marginRight = "0.5rem"
            const leftPartDOM = this.shadowRoot.getElementById("left-part")
            leftPartDOM.insertBefore(imgDom, leftPartDOM.firstChild)
        }
    }
}

customElements.define('transaction-component', TransactionTab);