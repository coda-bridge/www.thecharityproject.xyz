class Selector extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({mode: 'open'});
    }

    get value() {
        const thisName = this.shadowRoot.querySelector("#roleValue").textContent;
        const thisValue = this.shadowRoot.querySelector("#role").value;
        if (thisName === thisValue) {
            return thisValue;
        } else {
            return {name: thisName, value: thisValue};
        }
    }

    render() {
        this.shadowRoot.innerHTML = `
        <style>
            #selectOptionList div:hover {
                background-color: #ccc;
            }
            
            .normal-body {
                border:1px solid var(--base-green);
                padding: 0.8rem 1rem;
            }
            
            .normal-list {
                border:1px solid var(--base-green);
                border-top: 0;
                padding: 0.2rem 0;
            }
        </style>
        <div id="roleSelect" tabIndex="-1"
             style="cursor: pointer;display: flex;justify-content: space-between;align-items: center;border-radius: 0.6rem;">
            <div id="roleValue" style="user-select: none;line-height:1.5rem;width: 100%;color: rgb(89,92,95);padding-right: 0.1rem;overflow: hidden;text-overflow: ellipsis;white-space: nowrap;">
                ${this.placeholder || ""}
            </div>
            <input style="display: none;line-height:1.5rem;" name="role" id="role">
            <img width="20" height="20" src="https://www.thecharityproject.xyz/media/Selector.svg"/>
        </div>
        <div id="selectOptionList"
             style="z-index: 50;position:absolute;display: none;background-color: white;border-radius:0 0 0.6rem 0.6rem;">
        </div>
    `
    }

    connectedCallback() {
        this.render()

        const that = this;

        const roleSelect = this.shadowRoot.querySelector("#roleSelect");
        const select = roleSelect.querySelector("#roleValue");
        const roleInput = roleSelect.querySelector("#role");
        const selectOptionList = this.shadowRoot.querySelector("#selectOptionList");

        this.dispatchEvent(new CustomEvent('changeCallBack', {
            composed: true
        }));

        function transDate(dateText, locales) {
            const month = new Date(dateText).toLocaleString(locales, {month: 'short'});
            const year = new Date(dateText).getFullYear();
            return month + " " + year;
        }



        function transText(e) {
            const language = e ? e.setValue.value : localStorage.getItem("codaLanguage")
            selectOptionList.querySelectorAll("div").forEach(item => {
                if (that.type === "time") {
                    if (item.id === roleInput.value) {
                        select.innerText = transDate(item.name, language === "en" ? "en-US" : "zh-HK");
                    }
                    item.innerText = transDate(item.name, language === "en" ? "en-US" : "zh-HK");
                } else {
                    if (item.id === roleInput.value) {
                        select.innerText = t(item.name);
                    }
                    item.innerText = t(item.name);
                }
            })
        }

        if (this.list) {
            this.list.forEach(value => {
                const valueItem = document.createElement('div');
                valueItem.style.cursor = "pointer";
                if (!this.type || this.type === "normal") {
                    valueItem.style.padding = "0.7rem 1rem";
                } else {
                    valueItem.style.padding = "0.7rem 0";
                }
                if (typeof value === "object") {
                    valueItem.id = value.value.toString();
                    valueItem.name = value.name.toString();
                    valueItem.innerText = t(value.name.toString());
                } else {
                    valueItem.id = value.toString();
                    valueItem.name = value.toString();
                    valueItem.innerText = t(value.toString());
                }
                selectOptionList.appendChild(valueItem)
                if (this.defaultValue) {
                    setValue(this.defaultValue)
                }
            })
            transText();
            syncWidth();
        }

        window.addEventListener('setLanguage', (e)=>{
            transText(e)
        });

        if (!this.type || this.type === "normal") {
            roleSelect.className = "normal-body"
            selectOptionList.className = "normal-list"
        } else {
            roleSelect.style.padding = "0.5rem 0"
            roleSelect.style.border = "1px solid transparent"
        }

        function open() {
            syncWidth();
            if (that.type && that.type !== "normal") {
                roleSelect.style.border = "1px solid var(--base-green)"
                selectOptionList.style.border = "1px solid var(--base-green)"
            }
            roleSelect.style.borderRadius = "0.6rem 0.6rem 0 0"
            selectOptionList.style.display = "block"
            selectOptionList.addEventListener('mousedown', selectValue)
        }

        function close() {
            roleSelect.style.borderRadius = "0.6rem"
            selectOptionList.style.display = "none"
            selectOptionList.removeEventListener('mousedown', selectValue)
            const roleInput = roleSelect.querySelector("#role");
            if (that.type && that.type !== "normal") {
                roleSelect.style.borderColor = "transparent"
                selectOptionList.style.borderColor = "transparent"
            } else if (roleInput.value) {
                roleSelect.style.borderColor = "var(--base-green)"
            } else {
                roleSelect.style.borderColor = "red"
            }
        }

        roleSelect.addEventListener('click', e => {
            const currentDiv = e.currentTarget;
            if (currentDiv.style.borderRadius === "0.6rem") {
                open()
            } else {
                close()
            }
        });
        roleSelect.addEventListener('blur', e => {
            const currentDiv = e.currentTarget;
            close(currentDiv)
        })

        function setValue(value) {
            let thisCheckValue
            select.style.color = "black"
            if (typeof value === "string") {
                select.innerText = t(value)
                thisCheckValue = value
            } else {
                select.innerText = t(value.name)
                thisCheckValue = value.value
            }
            roleInput.value = thisCheckValue
            const divs = selectOptionList.querySelectorAll('div');
            divs.forEach(div => {
                if (div.id !== thisCheckValue) {
                    div.style.backgroundColor = "white";
                } else {
                    div.style.backgroundColor = "rgba(73,176,93,0.5)";
                }
            });
        }

        function selectValue(e) {
            if (e.target.tagName === 'DIV' && e.target.id && e.target.id !== "selectOptionList") {
                const thisName = e.target.innerText
                const thisValue = e.target.id
                let finalData
                if (thisName === thisValue) {
                    finalData = thisName
                } else {
                    finalData = {name: thisName, value: thisValue}
                }
                setValue(finalData)
                syncWidth()
                if (that.changeCallBack) {
                    that.changeCallBack(finalData)
                }
            }
        }

        //下拉选框宽度矫正
        function syncWidth() {
            selectOptionList.style.width = roleSelect.clientWidth + "px"
        }

        syncWidth();
        window.addEventListener('resize', syncWidth);
    }
}

customElements.define('select-component', Selector);
