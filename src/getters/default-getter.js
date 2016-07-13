import log from 'loglevel';
import '../utils/promise-utils'

import {
    getUrlFromClient,
    getTagNameFromClient,
    getTextFromClient,
    getSelectTextFromClient,
    getAttributeFromClient,
    checkboxValueFromClient
} from '../utils/client';

function checkbox(element, {glance}) {
    return glance.browser.execute(getAttributeFromClient, element, "type").then(function (attributeType) {
        if (attributeType.toLowerCase() === "checkbox") {
            return glance.browser.execute(checkboxValueFromClient, element.value, name);
        }

        return Promise.reject();
    });
}

function input(element, {glance}) {
    return glance.browser.getValue(element);
}

export default function (selector, config) {
    var {glance} = config;

    if(selector == "$browser:url") {
        return glance.browser.execute(getUrlFromClient);
    }

    return glance.element(selector).then((element)=> {
        return glance.browser.execute(getTagNameFromClient, element).then(function (tagName) {
            switch (tagName.toLowerCase()) {
                case "input":
                    return [
                        checkbox,
                        input
                    ].firstResolved(strategy => strategy(element, config));

                case "select":
                    return glance.browser.execute(getSelectTextFromClient, element);

                default:
                    return glance.browser.execute(getTextFromClient, element);
            }

            return Promise.reject("No Getter Found");
        });
    });
}