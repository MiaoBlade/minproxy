window.addEventListener("load", function (e) {

    let title = chrome.i18n.getMessage("option_title")
    window.title = title
    var editor = new JSONEditor(document.getElementById('editor_holder'), {
        // The schema for the editor
        schema: {
            title: title,
            type: "array",
            format: "table",
            items: {
                type: "object",
                properties: {
                    name: {
                        type: "string",
                        title: chrome.i18n.getMessage("option_header_name"),
                        minLength: 1
                    },
                    host: {
                        type: "string",
                        title: chrome.i18n.getMessage("option_header_host"),
                    },
                    port: {
                        type: "integer",
                        title: chrome.i18n.getMessage("option_header_port"),
                    }
                }
            }

        },
        disable_array_delete_all_rows: true,
        disable_array_delete_last_row: true,
        disable_array_reorder: true,
        disable_collapse: true
    });

    document.getElementById('apply').addEventListener('click', function () {
        var errors = editor.validate()
        var indicator = document.getElementById('valid_indicator');

        if (errors.length) {
            indicator.className = 'label alert';
            indicator.textContent = 'not valid';
        }
        else {
            indicator.className = 'label success';
            indicator.textContent = 'valid';

            window.minproxy.proxies = editor.getValue()

            chrome.storage.local.set({ 'minproxy': window.minproxy }, function () {
                if (chrome.runtime.lastError) {
                    console.error(chrome.runtime.lastError.message)
                }
            });
        }
    });

    chrome.storage.local.get(['minproxy'], function (result) {
        if (chrome.runtime.lastError) {
            console.error(chrome.runtime.lastError.message)
        } else {
            window.minproxy = result['minproxy']
            editor.setValue(window.minproxy.proxies)
        }
    });
});
