import log from 'loglevel';
import '../utils/promise-utils'

import {
    setUrlFromClient,
    getTagNameFromClient,
    // getTextFromClient,
    // getSelectTextFromClient,
    getAttributeFromClient,
    setCheckboxValueFromClient
} from '../utils/client';

function checkbox(element, values, {glance}) {
    return glance.browser.execute(getAttributeFromClient, element, "type").then(function (attributeType) {
        if (attributeType.toLowerCase() === "checkbox") {
            return glance.browser.execute(setCheckboxValueFromClient, element, ...values);
        }

        return Promise.reject();
    });
}

function input(element, values, {glance}) {
    return glance.browser.setValue(element, ...values);
}

export default function (selector, values, config) {
    var {glance} = config;

    if (selector == "$browser:url") {
        return glance.browser.setUrl(...values);
    }

    return glance.element(selector).then((element)=> {
        return glance.browser.execute(getTagNameFromClient, element).then(function (tagName) {
            switch (tagName.toLowerCase()) {
                case "input":
                    return [
                        checkbox,
                        input
                    ].firstResolved(strategy => strategy(element, values, config));

                //             case "select":
                //                 return glance.browser.execute(getSelectTextFromClient, element);
                //
                //             default:
                //                 return glance.browser.execute(getTextFromClient, element);
            }

            return Promise.reject("No Getter Found");
        });
    });


}