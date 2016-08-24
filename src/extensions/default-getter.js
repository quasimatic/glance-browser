import valueExtension from "./value";
import textExtension from "./text";

import '../utils/promise-utils'
import {
    getTagNameFromClient,
    getTextFromClient
} from '../utils/client';

export default {
    properties: {
        defaultgetter: {
            get: function (data) {
                let {selector, glance, target, element} = data
                var elementPromise = element? Promise.resolve(element) : glance.element(selector);

                return elementPromise.then((element)=> {
                    return glance.browser.execute(getTagNameFromClient, element).then(function (tagName) {
                        switch (tagName.toLowerCase()) {
                            case 'input':
                            case 'textarea':
                                return valueExtension.properties.value.get({...data, element});
                            case 'select':
                                return textExtension.properties.text.get({...data, element});
                            default:
                                return glance.browser.execute(getTextFromClient, element);
                        }

                        return Promise.reject("No Getter Found");
                    });
                });
            }
        }

    }
}
