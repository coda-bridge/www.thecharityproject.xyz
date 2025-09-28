class TransactionTab extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({mode: 'open'});
    }

    render() {
        function formatDate(timestamp) {
            const differentLength = 13 - timestamp.toString().length;
            const date = new Date(parseInt(timestamp) * Math.pow(10, differentLength));
            return date.toLocaleString('en', {
                // year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit'
            });
        }

        this.shadowRoot.innerHTML = `
            <style>
                .transaction-card {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    padding: 1rem;
                    border-radius: 0.5rem;
                    background-color: white;
                    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                    margin-bottom: 1rem;
                    transition: box-shadow 0.3s ease;
                }
                .transaction-card:hover {
                    box-shadow: 0 6px 10px rgba(0, 0, 0, 0.15);
                }
                .transaction-details {
                    display: flex;
                    align-items: center;
                }
                .transaction-details img {
                    width: 3rem;
                    height: 3rem;
                    border-radius: 50%;
                    margin-right: 1rem;
                }
                .transaction-amount {
                    font-size: 1.2rem;
                    font-weight: 700;
                    color: var(--base-green);
                }
                .transaction-time {
                    font-size: 0.9rem;
                    color: #555;
                }
            </style>
            <div class="transaction-card">
                <div class="transaction-details">
                    ${this.img ? `<img src="${this.img}" alt="Transaction Image">` : ""}
                    <div>${this.name}</div>
                </div>
                <div>
                    <div class="transaction-amount">${this.price < 0 ? "-" : "+"}${Math.abs(this.price)}</div>
                    <div class="transaction-time">${formatDate(this.time)}</div>
                </div>
            </div>
        `
    }

    connectedCallback() {
        this.render()
    }
}

customElements.define('transaction-component', TransactionTab);