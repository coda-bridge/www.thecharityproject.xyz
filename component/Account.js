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
        this.phoneReg = {1: /^\d{10}$/, 65: /^([8|9])\d{7}$/, 852: /^\d{8}$/, 86: /^1\d{10}$/}
        this.emailReg = /^[a-zA-Z\d_.-]+@[a-zA-Z\d-]+(\.[a-zA-Z\d-]+)*\.[a-zA-Z\d]{2,6}$/
        this.shadowRoot.innerHTML = `
    <style>
        input {
            width: 100%;
            padding: 0.75rem 1rem;
            font-size: 1rem;
            border: 1px solid var(--base-green);
            border-radius: 0.5rem;
            outline: none;
            transition: border-color 0.3s ease;
        }
        input:focus {
            border-color: #333;
        }
        select-component {
            margin-right: 1rem;
        }
    </style>
    <div id="phone" style="margin-top: 2rem" class="form-group">
        <div style="display:flex;align-items: center;">
            <input style="display: none;" name="phone_country" id="phone_country">
            <input type="tel" id="phone_number" class="form-control">
        </div>
            <div style="font-size: 0.7rem;margin-top: 1rem;">
                Phone number doesn't work? <span id="to_email" style="cursor: pointer;text-decoration-line: underline;user-select: none;">Try email here</span>
            </div>
    </div>
    
    <div id="email" style="display: none;margin-top: 2rem;" class="form-group">
            <div style="display: flex;">
                <input style="font-size: 1rem;line-height: 1.5rem;flex: 1;border:1px solid var(--base-green);border-radius: 0.6rem;padding: 0.5rem 0.75rem" type="email"
                   class="form-control"
                   name="email_address" id="email_address" placeholder="Enter your email address">
            </div>
            <div style="font-size: 0.7rem;margin-top: 1rem;">
            Email doesn't work? <span id="to_phone" style="cursor: pointer;text-decoration-line: underline;user-select: none;">Try phone number here</span>
            </div>
        </div>
    `
    }

    connectedCallback() {

        const that = this;

        this.render()

        const phonePlace = this.shadowRoot.getElementById('phone');
        const emailPlace = this.shadowRoot.getElementById('email');
        const phoneNumber = this.shadowRoot.getElementById('phone_number');
        const phoneCountry = this.shadowRoot.getElementById('phone_country');
        const emailAddress = this.shadowRoot.getElementById('email_address');
        const toPhoneTab = this.shadowRoot.getElementById('to_phone');
        const toEmailTab = this.shadowRoot.getElementById('to_email');
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

        countrySelector.list = ["+1", "+65","+86", "+852"];
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


        emailAddress.addEventListener("input", () => {
            const value = emailAddress.value;
            if (this.emailReg.test(value)) {
                emailAddress.style.borderColor = "var(--base-green)";
            }
            if (this.changeCallBack) {
                this.changeCallBack();
            }
        })
        emailAddress.addEventListener("blur", () => {
            const value = emailAddress.value;
            if (this.emailReg.test(value)) {
                emailAddress.style.borderColor = "var(--base-green)"
            } else {
                emailAddress.style.borderColor = "red"
            }
        })


        function toPhone() {
            phonePlace.style.display = "block";
            emailPlace.style.display = "none";
            phoneNumber.style.borderColor = "var(--base-green)";
        }

        toPhone()

        function toEmail() {
            emailPlace.style.display = "block";
            phonePlace.style.display = "none";
            checkValidity()
        }

        toPhoneTab.addEventListener("click", toPhone)
        toEmailTab.addEventListener("click",toEmail)
    }

    checkInputType() {
        if (this.shadowRoot.getElementById('phone').style.display === "block") {
            return "phone"
        } else {
            return "email"
        }
    }

    setDisabled(boolean) {
        this.shadowRoot.getElementById('phone_number').disabled = boolean;
        this.shadowRoot.querySelector('select-component').setDisabled(boolean);
    }
}

customElements.define('account-component', Account);
