

/**
 * A utility wrapper for DOM elements to apply common actions.
 * @param {HTMLElement|HTMLElement[]|NodeList|null} element
 * @returns {{
 *   element: HTMLElement|HTMLElement[],
 *   on: (event: string, handler: EventListenerOrEventListenerObject,options?: boolean | AddEventListenerOptions) => void,
 *   get: () => HTMLElement|HTMLElement[]
 * }}
 */
function actions(element = null) {
    if (!element || typeof element != "object") {
        return {
            element: null,
            on: () => { },
            get: () => { },
        }
    }
    if ("element" in element) {
        return element;
    }

    /**
     * @param {(item:HTMLElement,index?:number) => void} callback
     * @method Function
     * Applies a callback to each item in the element(s)
     */
    const each = (callback) => {
        if (element && typeof element.forEach === 'function') {
            element.forEach(callback);
        } else {
            callback(element, 0);
        }
    };



    const array = Array.isArray(element);
    const data = {
        element,
        on: () => { },
        each,
        get: (selector) => {
            return get(selector, { element })
        },
    }

    data.on = (action, callback, options = undefined) => {
        if (array) {
            data.element.forEach((single, index) => {
                if (single) {
                    single["__index"] = index;
                }
                single?.addEventListener(action, callback, options)
            });
        } else {
            if (data.element) {
                data.element["__index"] = index;
            }
            data.element?.addEventListener(action, callback, options)
        }

    }
    return data;
}
/**
 * 
 * @param {string} selector 
 * @param {{
 * single:boolean,
 * element:null|HTMLElement|HTMLElement[]
 * }} options 
 * @returns 
 */
function get(selector, options = {}) {
    options = {
        single: false,
        element: null,
        ...options
    }
    /**
     * @static {HTMLElement[]}
     */
    const pre = [];


    if (options.element && typeof options.element == "object") {
        if (Array.isArray(options.element)) {
            options.element.forEach(item => {
                const tmp = item.querySelectorAll(selector);
                if (tmp) {
                    [...tmp].forEach(html => {
                        pre.push(html)
                    })
                }
            })
        } else {
            const sinTemp = options.element.querySelectorAll(selector);
            if (sinTemp) {
                [...sinTemp].forEach(html => {
                    pre.push(html)
                })
            }
        }
    } else {
        const el = document.querySelectorAll(selector);
        if (el) {
            [...el].forEach(html => {
                pre.push(html)
            })
        }
    }
    if (pre.length == 0) {
        return null;
    }

    const data = actions([...pre]);
    return data

}

const defaultData = [
    {
        "logo": "./assets/images/logo-devlens.svg",
        "name": "DevLens",
        "description": "Quickly inspect page layouts and visualize element boundaries.",
        "isActive": true
    },
    {
        "logo": "./assets/images/logo-style-spy.svg",
        "name": "StyleSpy",
        "description": "Instantly analyze and copy CSS from any webpage element.",
        "isActive": true
    },
    {
        "logo": "./assets/images/logo-speed-boost.svg",
        "name": "SpeedBoost",
        "description": "Optimizes browser resource usage to accelerate page loading.",
        "isActive": false
    },
    {
        "logo": "./assets/images/logo-json-wizard.svg",
        "name": "JSONWizard",
        "description": "Formats, validates, and prettifies JSON responses in-browser.",
        "isActive": true
    },
    {
        "logo": "./assets/images/logo-tab-master-pro.svg",
        "name": "TabMaster Pro",
        "description": "Organizes browser tabs into groups and sessions.",
        "isActive": true
    },
    {
        "logo": "./assets/images/logo-viewport-buddy.svg",
        "name": "ViewportBuddy",
        "description": "Simulates various screen resolutions directly within the browser.",
        "isActive": false
    },
    {
        "logo": "./assets/images/logo-markup-notes.svg",
        "name": "Markup Notes",
        "description": "Enables annotation and notes directly onto webpages for collaborative debugging.",
        "isActive": true
    },
    {
        "logo": "./assets/images/logo-grid-guides.svg",
        "name": "GridGuides",
        "description": "Overlay customizable grids and alignment guides on any webpage.",
        "isActive": false
    },
    {
        "logo": "./assets/images/logo-palette-picker.svg",
        "name": "Palette Picker",
        "description": "Instantly extracts color palettes from any webpage.",
        "isActive": true
    },
    {
        "logo": "./assets/images/logo-link-checker.svg",
        "name": "LinkChecker",
        "description": "Scans and highlights broken links on any page.",
        "isActive": true
    },
    {
        "logo": "./assets/images/logo-dom-snapshot.svg",
        "name": "DOM Snapshot",
        "description": "Capture and export DOM structures quickly.",
        "isActive": false
    },
    {
        "logo": "./assets/images/logo-console-plus.svg",
        "name": "ConsolePlus",
        "description": "Enhanced developer console with advanced filtering and logging.",
        "isActive": true
    }
]

const toggle = get("#toogle_theme");
toggle.on("click", (e) => {
    document.body.parentNode.classList.toggle("dark")
})

const tab = get("#tabs .btn");

const currentData = {
    tab: 0,
    data: [...defaultData],
}


/**
 * Creates an HTML element with the specified tag and attributes.
 * 
 * @param {string} tag The type of HTML element to create (e.g., 'div', 'span').
 * @param {Object} options An object containing attributes to set on the element. 
 *                         You can include:
 *                         - standard HTML attributes like `id`, `className`, etc.
 *                         - special properties like `innerHTML` to set the content of the element.
 * @returns {HTMLElement} The created HTML element.
 */
const add = (tag = "div", options = {}) => {
    const el = document.createElement(tag);

    // Iterate over options and set properties
    for (const key in options) {
        // If the key is 'innerHTML', set it as innerHTML
        if (key === 'innerHTML') {
            el.innerHTML = options[key];
        } else {
            el[key] = options[key];
        }
    }

    return actions(el);
}

const wait = async (time = 0.3) => {
    await new Promise(res => {
        setTimeout(() => {
            res(true)
        }, time * 1000)
    })
}
function alertWithCallback(message, callback) {
    // Show the confirm dialog (OK / Cancel)
    const userResponse = confirm(message);

    // Call the callback with the user's response
    callback(userResponse);
}


let animating = false;
tab.on("click", function (e) {
    if (animating) {
        return;
    }
    const index = this.__index;
    currentData.tab = index;
    document.body.setAttribute("data-tab", index)
    tab.each((item, i) => {
        const type = index == i ? "add" : "remove";
        item.classList[type]("active");
    });
})
const main = document.querySelector("main");
const renders = [];
/**
 * 
 * @param {{
 * logo:string,
 * name:string,
 * description:string,
 * isActive:boolean
 * }} data 
 */
async function getRender(data, index) {
    const className = data.isActive ? "addon_card none active" : "addon_card none";
    let innerHTML = `<div class="info">`;
    innerHTML += `<div class="img"><img src="${data.logo}" width="60" height="60"></div>`;
    innerHTML += `<div class="data"><h2>${data.name}</h2><p>${data.description}</p></div>`;
    innerHTML += "</div>";
    innerHTML += `<div class="actions">`;
    innerHTML += `<div class="btn">Remove</div>`;
    innerHTML += `<div class="switch${data.isActive ? " active" : ""}"></div>`;
    innerHTML += `</div>`;

    const parent = add("div", {
        className: data.isActive ? "addon_card_container none active" : "addon_card_container none"
    });
    const element = add("div", {
        className,
        innerHTML,
    });
    const remove = element.get(".btn");

    const hide = async () => {
        animating = true;
        element.element.style.transform = "scale(0)";
        await wait(0.2);
        parent.element.style.width = "0px";
        parent.element.style.marginLeft = "-16px";
        await wait(0.4);
        parent.element.style.display = "none";

        animating = false;
    }

    const show = async () => {
        animating = true;
        parent.element.style.display = "";
        await wait(0.05);
        parent.element.style.width = "";
        await wait(0.3);
        element.element.style.transform = "";
        await wait();
        animating = false;

    }
    remove.on("click", async () => {
        const userResponse = confirm(`Do you want to remove "${data.name}"?`);
        if (!userResponse) {
            return;
        }
        const info = element.element.getBoundingClientRect();
        element.element.style.transition = "unset";
        element.element.style.zIndex = "-1";
        element.element.style.width = info.width + "px";
        element.element.style.height = info.height + "px";
        parent.element.style.width = info.width + "px";
        parent.element.style.height = info.height + "px";
        await wait(0.1);
        element.element.style.transition = "";
        element.element.style.position = "absolute";
        element.element.classList.add("remove");
        await wait(0.3);
        parent.element.style.width = "0px";
        parent.element.style.marginLeft = "-16px";
        await wait(0.3);
        parent.element.style.display = "none";
        await wait(0.05);
        animating = false;
        parent.element.remove();
    })
    const Swi = element.get(".switch");
    Swi.on("click", () => {
        data.isActive = !data.isActive;
        const key = data.isActive ? "add" : "remove";
        parent.element.classList[key]("active");
        element.element.classList[key]("active");
    })

    parent.element.appendChild(element.element);
    main.appendChild(parent.element);
    await wait(0.3);
    await wait(0.075 * index);
    element.element.classList.remove("none");
    // console.log({ element, remove, Swi });
}

defaultData.forEach(getRender)