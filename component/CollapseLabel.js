class CollapseLabel extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({mode: 'open'});
    }

    render() {
        const name = this.getAttribute('name');
        const style = this.getAttribute('style');
        this.shadowRoot.innerHTML = `
            <style>
                .rotated-img {
                    transform: rotate(90deg);
                    transition: transform 0.3s ease;
                }
                #restaurant-info {
                    margin: 0.5rem 0;
                    border-radius: 0.5rem;
                    border: 1px solid var(--base-green);
                }
                #restaurant-info-button {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    cursor: pointer;
                    padding: 0.5rem 1rem;
                    transition: background-color 0.3s ease;
                }
                #restaurant-info-button.active {
                    background-color: rgba(73, 176, 93, 0.1);
                }
                #restaurant-info-text {
                    font-size: 0.9rem;
                    color: #555;
                    margin: 0.7rem 1rem;
                    display: none;
                }
            </style>
            <div id="restaurant-info">
                <div id="restaurant-info-button">
                    <trans-component text="${name}"></trans-component>
                    <img style="margin-left: 0.5rem" src="media/Go.svg">
                </div>
                <div id="restaurant-info-text"></div>
            </div>`
    }

    connectedCallback() {
        this.render()
        const restaurantInfoButton = this.shadowRoot.getElementById("restaurant-info-button");
        const restaurantInfoText = this.shadowRoot.getElementById("restaurant-info-text");

        restaurantInfoText.innerHTML = '';

        Array.from(this.children).forEach(child => {
            restaurantInfoText.appendChild(child.cloneNode(true));
        });

        restaurantInfoButton.addEventListener("click", () => {
            if (!restaurantInfoText.style.display || restaurantInfoText.style.display === "none") {
                restaurantInfoText.style.display = "block"
                restaurantInfoButton.classList.add("active");
                restaurantInfoButton.querySelector("img").className = "rotated-img"
            } else {
                restaurantInfoText.style.display = "none"
                restaurantInfoButton.classList.remove("active");
                restaurantInfoButton.querySelector("img").className = ""
            }
        })
    }
}

customElements.define('collapse-component', CollapseLabel);