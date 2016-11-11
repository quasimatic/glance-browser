function tagElementWithID(elements, ids) {
    for (var i = 0; i < elements.length; ++i) {
        elements[i].setAttribute("data-glance-id", ids[i]);
    }
}

function waitForChange(element, name) {
    return element.getAttribute(name);
}

function getAttributeFromClient(element, name) {
    return element.getAttribute(name);
}

function addPropertiesToBrowser(propertyString) {
    function functionReviver(key, value) {
        if (key === "") return value;
        if (typeof value === 'string') {
            var startOfFunc = /^function[^\(]*\(([^\)]*)\)[^\{]*\{/;
            var match = value.match(startOfFunc);

            if (match) {
                var args = match[1].split(',').map(function (arg) {
                    return arg.replace(/\s+/, '');
                });
                return new Function(args, value.replace(startOfFunc, '').replace(/\}$/, ''));
            }
        }

        return value;
    }

    var properties = JSON.parse(propertyString, functionReviver);
    glanceSelector.addExtension({
        properties: properties
    });
}

function serializeBrowserSideProperties(properties) {
    function functionReplacer(key, value) {
        if (typeof(value) === 'function') {
            return value.toString();
        }
        return value;
    }

    var browserSideProperties = Object.keys(properties).reduce((o, k) => {
        if (properties[k].browser) {
            o[k] = properties[k];
        }
        return o;
    }, {});

    return JSON.stringify(browserSideProperties, functionReplacer);
}

function getTagNameFromClient(element) {
    return element.tagName;
}

function getAttributeFromClient(element, attribute) {
    return element.getAttribute(attribute);
}

function checkboxValueFromClient(element) {
    return element.checked;
}

function getTextFromClient(element) {
    return element.textContent;
}

function getUrlFromClient() {
    return window.location.href;
}

function setUrlFromClient(url) {
    return window.location.href = url;
}

function getHTMLFromClient(element) {
    return element.outerHTML;
}

function getSelectTextFromClient(select) {
    var i = select.selectedIndex;
    if (i == -1) return;

    return select.options[i].text;
}

function getSelectValueFromClient(select) {
    var i = select.selectedIndex;
    if (i == -1) return;

    return select.options[i].value;
}

function getOptionFromValue(select, value) {
    for (var i = 0; i < select.options.length; i++) {
        if (select.options[i].value === value) {
            return select.options[i];
        }
    }

    return null;
}

function getTextareaValueFromClient(textarea) {
    return textarea.value;
}

function setTextareaValueFromClient(textarea, value) {
    textarea.value = value;
    return value;
}

function getOptionFromText(select, text) {
    for (var i = 0; i < select.options.length; i++) {
        if (select.options[i].text === text) {
            return select.options[i];
        }
    }

    return null;
}

function checkGlanceSelector() {
    return typeof(glanceSelector) != 'undefined';
}

function triggerChange(element) {
    if ("createEvent" in document) {
        var evt = document.createEvent("HTMLEvents");
        evt.initEvent("change", false, true);
        element.dispatchEvent(evt);
    }
    else
        element.fireEvent("onchange");
}

export {
    checkGlanceSelector,
    addPropertiesToBrowser,
    serializeBrowserSideProperties,
    getAttributeFromClient,
    getTagNameFromClient,
    getTextFromClient,
    getUrlFromClient,
    setUrlFromClient,
    getHTMLFromClient,
    getSelectTextFromClient,
    getSelectValueFromClient,
    waitForChange,
    tagElementWithID,
    checkboxValueFromClient,
    triggerChange,
    getTextareaValueFromClient,
    setTextareaValueFromClient,
    getOptionFromValue,
    getOptionFromText
}