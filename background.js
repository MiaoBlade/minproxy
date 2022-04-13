var me = {
    selected: -1,
    proxies: [],
    defaultSetting: [
        {
            name: "socks5",
            host: "127.0.0.1",
            port: 1080
        },
    ]
}

function loadConfig() {
    chrome.storage.local.get(['minproxy'], function (result) {
        if (chrome.runtime.lastError) {
            console.error(chrome.runtime.lastError.message)
        } else {
            if (result['minproxy']) {
                setupExtension()
            } else {
                initConfig()
            }
        }
    });
}
function initConfig() {
    me.proxies = me.defaultSetting
    chrome.storage.local.set({ 'minproxy': me }, function () {
        if (chrome.runtime.lastError) {
            console.error(chrome.runtime.lastError.message)
        } else {
            setupExtension()
        }
    });
}
function setupExtension() {
    chrome.proxy.settings.get({ 'incognito': true },
        function (config) {
            let icon = {}
            mode = config["value"]["mode"]
            if (mode == "system" || mode == "direct") {
                icon["path"] = "images/off.png";
            } else {
                icon["path"] = "images/on.png";
            }
            chrome.action.setIcon(icon);
        }
    );
    chrome.proxy.onProxyError.addListener(function (details) {
        console.log("fatal: ", details.fatal);
        console.log("error: ", details.error);
        console.log("details: ", details.details)
    });
    chrome.runtime.onInstalled.addListener(function (details) {
    });
}

loadConfig()