class Selector extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({mode: 'open'});
    }

    get value() {
        return this.shadowRoot.querySelector("#role").value;
    }

    render() {
        this.shadowRoot.innerHTML = `
        <style>
            #selectOptionList div:hover {
                background-color: #ccc;
            }
            
            .normal-body {
                border:1px solid var(--base-green);
                padding: 0.5rem 0.75rem;
            }
            
            .normal-list {
                border:1px solid var(--base-green);
                border-top: 0;
                padding: 0.2rem 0;
            }
        </style>
        <div id="roleSelect" tabIndex="-1"
             style="cursor: pointer;display: flex;justify-content: space-between;align-items: center;border-radius: 0.6rem;">
            <div id="roleValue" style="user-select: none;width: 100%;color: rgb(89,92,95);padding-right: 0.1rem;overflow: hidden;text-overflow: ellipsis;white-space: nowrap;">
                Select your role here first
            </div>
            <input style="display: none" name="role" id="role">
            <img width="20" src="media/Selector.svg"/>
        </div>
        <div id="selectOptionList"
             style="z-index: 50;position:absolute;display: none;background-color: white;border-radius:0 0 0.6rem 0.6rem;">
        </div>
    `
    }

    connectedCallback() {
        this.render()

        const that = this;

        const roleSelect = this.shadowRoot.querySelector("#roleSelect")
        const selectOptionList = this.shadowRoot.querySelector("#selectOptionList")

        if (this.list) {
            this.list.forEach(value => {
                const valueItem = document.createElement('div');
                valueItem.style.cursor = "pointer";
                if(!this.type || this.type === "normal"){
                    valueItem.style.padding = "0.5rem 0.75rem";
                }else {
                    valueItem.style.padding = "0.5rem 0";
                }
                valueItem.id = value.toString();
                valueItem.innerText = value.toString();
                selectOptionList.appendChild(valueItem)
                if (this.defaultValue) {
                    setValue(this.defaultValue)
                }
            })
            syncWidth();
        }

        if (!this.type || this.type === "normal") {
            roleSelect.className = "normal-body"
            selectOptionList.className = "normal-list"
        }

        function open() {
            roleSelect.style.borderRadius = "0.6rem 0.6rem 0 0"
            selectOptionList.style.display = "block"
            selectOptionList.addEventListener('mousedown', selectValue)
        }

        function close() {
            roleSelect.style.borderRadius = "0.6rem"
            selectOptionList.style.display = "none"
            selectOptionList.removeEventListener('mousedown', selectValue)
            const roleInput = roleSelect.querySelector("#role");
            if (roleInput.value) {
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
            const select = roleSelect.querySelector("#roleValue");
            const roleInput = roleSelect.querySelector("#role");
            select.style.color = "black"
            select.textContent = value
            roleInput.value = value
            const divs = selectOptionList.querySelectorAll('div');
            divs.forEach(div => {
                if (div.id !== value) {
                    div.style.backgroundColor = "white";
                } else {
                    div.style.backgroundColor = "rgba(73,176,93,0.5)";
                }
            });
        }

        function selectValue(e) {
            if (e.target.tagName === 'DIV' && e.target.id && e.target.id !== "selectOptionList") {
                setValue(e.target.id)
                if(that.changeCallBack){
                    that.changeCallBack(e.target.id)
                }else {
                    this.dispatchEvent(new CustomEvent('changeCallBack', {
                        composed: true
                    }));
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
