
function setProxing(isOn) {
    let path = isOn ? 'images/on.png' : 'images/off.png'
    chrome.action.setIcon({
        path: path
    });
}

function fixedProxy(proxy) {
    var config = {
        mode: 'fixed_servers',
        rules: {}
    };

    config.rules["singleProxy"] = {
        scheme: "socks5",
        host: proxy.host,
        port: parseInt(proxy.port)
    };

    chrome.proxy.settings.set(
        { value: config, scope: 'regular' },
        function () { });

    setProxing(true);
}

function directProxy() {
    chrome.proxy.settings.set(
        {
            value: {
                mode: 'direct',
            },
            scope: 'regular'
        },
        function () { });

    setProxing(false)
}

function sysProxy() {
    chrome.proxy.settings.set(
        {
            value: { mode: 'system' },
            scope: 'regular'
        },
        function () { });

    setProxing(false);
}

var data
function loadProxy() {
    chrome.storage.local.get(['minproxy'], function (result) {
        if (chrome.runtime.lastError) {
            console.error(chrome.runtime.lastError.message)
        } else {
            data = result['minproxy']
            if (data.proxies != undefined && data.proxies != null) {
                buildUI()
            } else {
                console.error("setting invalid")
            }
        }
    });
}
function buildUI() {
    let root = document.getElementById("proxy_option")
    let item = buildItem(chrome.i18n.getMessage("popup_name_direct"), 0, root)
    item = buildItem(chrome.i18n.getMessage("popup_name_system"), 1, root)
    for (let index = 0; index < data.proxies.length; index++) {
        const element = data.proxies[index];
        let item = buildItem(element.name, index + 2, root)
        if (index + 2 == data.selected) {
            item.classList.add("selected")
        }
    }
}
function buildItem(label, id, parent) {
    let item = document.createElement("li")
    item.innerText = label
    item.addEventListener("click", handleClick)
    item.pxid = id
    if (id == data.selected) {
        item.classList.add("selected")
    }
    parent.appendChild(item)
    return item
}

function handleClick(e) {
    let index = e.target.pxid
    switch (index) {
        case 0:
            directProxy()
            break;
        case 1:
            sysProxy()
            break
        default:
            fixedProxy(data.proxies[index - 2])
            break;
    }
    data.selected = index
    var list = document.getElementsByTagName("li")
    for (let index = 0; index < list.length; index++) {
        const element = list[index];
        element.classList.remove('selected')
    }
    e.target.classList.add('selected');

    chrome.storage.local.set({ 'minproxy': data }, function () {
        if (chrome.runtime.lastError) {
            console.error(chrome.runtime.lastError.message)
            return
        }
        // setTimeout(window.close, 1)
    });
}

document.addEventListener("DOMContentLoaded", function () {
    loadProxy()
});
