class Account extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({mode: 'open'});
    }

    get type() {
        return this.checkInputType();
    }

    get value() {
        if (this.checkInputType() === "phone") {
            return {
                phone_country: this.shadowRoot.getElementById('phone_country').value,
                phone_number: this.shadowRoot.getElementById('phone_number').value
            };
        } else {
            return {
                email_address: this.shadowRoot.getElementById('email_address').value
            };
        }
    }

    get check() {
        if (this.checkInputType() === "phone") {
            const phone_country = this.shadowRoot.getElementById('phone_country').value;
            const phone_number = this.shadowRoot.getElementById('phone_number').value;
            return phone_country && phone_number && this.phoneReg[phone_country].test(phone_number);
        } else {
            return this.emailReg.test(this.shadowRoot.getElementById('email_address').value);
        }
    }

    render() {
        this.phoneReg = {1: /^\d{10}$/, 65: /^([8|9])\d{7}$/, 852: /^([6|9])\d{7}$/, 86: /^1\d{10}$/}
        this.emailReg = /^[a-zA-Z\d_.-]+@[a-zA-Z\d-]+(\.[a-zA-Z\d-]+)*\.[a-zA-Z\d]{2,6}$/
        this.shadowRoot.innerHTML = `
        <div id="phone" style="margin-top: 2rem" class="form-group">
            <div style="display:flex;align-items: center;">
                <input style="display: none;" name="phone_country" id="phone_country">
                <input style="min-width: 0;margin-left: 1rem;font-size: 1rem;line-height: 1.5rem;flex: 1;border:1px solid var(--base-green);border-radius: 0.6rem;padding: 0.8rem 1rem;" type="tel"
                       class="form-control"
                       name="phone_number" id="phone_number">
            </div>
        </div>
    `
    }

    connectedCallback() {

        const that = this;

        this.render()

        const phonePlace = this.shadowRoot.getElementById('phone');
        const phoneNumber = this.shadowRoot.getElementById('phone_number');
        const phoneCountry = this.shadowRoot.getElementById('phone_country');
        const countrySelector = document.createElement("select-component");

        window.addEventListener('setLanguage', function (e) {
            phoneNumber.placeholder = t("Phone number");
        });

        phoneNumber.placeholder = t("Phone number");

        const setCountry = (countryCode) => {
            phoneCountry.value = parseInt(countryCode.replace("+", ""));
            let value = phoneNumber.value;
            if (this.phoneReg[phoneCountry.value].test(value)) {
                phoneNumber.style.borderColor = "var(--base-green)"
            } else {
                phoneNumber.style.borderColor = "red"
            }
            if (this.changeCallBack) {
                this.changeCallBack()
            }
        }

        countrySelector.list = ["+1", "+65", "+852", "+86"];
        countrySelector.placeholder = ""
        phoneCountry.value = 852
        countrySelector.defaultValue = "+852"
        countrySelector.changeCallBack = setCountry
        phoneNumber.parentNode.insertBefore(countrySelector, phoneNumber);

        this.dispatchEvent(new CustomEvent('changeCallBack', {
            composed: true
        }));

        phoneNumber.addEventListener("input", () => {
            let value = phoneNumber.value;
            const prevCursorPos = phoneNumber.selectionStart || 0;
            value = value.replace(/\D/, '');
            if (this.phoneReg[phoneCountry.value].test(value)) {
                phoneNumber.style.borderColor = 'var(--base-green)';
            }
            phoneNumber.value = value;
            phoneNumber.setSelectionRange(prevCursorPos, prevCursorPos);
            if (this.changeCallBack) {
                this.changeCallBack();
            }
        })
        phoneNumber.addEventListener("blur", () => {
            let value = phoneNumber.value;
            if (this.phoneReg[phoneCountry.value].test(value)) {
                phoneNumber.style.borderColor = "var(--base-green)"
            } else {
                phoneNumber.style.borderColor = "red"
            }
        })

        function toPhone() {
            phonePlace.style.display = "block";
            phoneNumber.style.borderColor = "var(--base-green)";
        }

        toPhone()
    }

    checkInputType() {
        return "phone"
    }

    setDisabled(boolean) {
        this.shadowRoot.getElementById('phone_number').disabled = boolean;
        this.shadowRoot.querySelector('select-component').setDisabled(boolean);
    }
}

customElements.define('account-component', Account);
