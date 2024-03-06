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
                }
            </style>
            <div>
                <div id="restaurant-info-button" style="display: flex;${style}">
                    <div>${name}</div>
                    <img style="margin-left: 0.5rem" src="media/Go.svg">
                </div>
                <div id="restaurant-info-text" style="font-size: 0.85rem;margin: 0.5rem 0 1rem;display: none;"></div>
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
            if (restaurantInfoText.style.display === "none") {
                restaurantInfoText.style.display = "block"
                restaurantInfoButton.querySelector("img").className = "rotated-img"
            } else {
                restaurantInfoText.style.display = "none"
                restaurantInfoButton.querySelector("img").className = ""
            }
        })
    }
}

customElements.define('collapse-component', CollapseLabel);