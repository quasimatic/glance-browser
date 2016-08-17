import valueExtension from "./value";
import textExtension from "./text";

import '../utils/promise-utils'
import {
    getTagNameFromClient
} from '../utils/client';

export default {
    properties: {
        defaultsetter: {
            set: function (data) {
                let {selector, glance, target, value, element} = data
                var elementPromise = element ? Promise.resolve(element) : glance.element(selector);

                return elementPromise.then((element)=> {
                    return glance.browser.execute(getTagNameFromClient, element).then(function (tagName) {
                        switch (tagName.toLowerCase()) {
                            case 'input':
                                return valueExtension.properties.value.set({...data, element});

                            case 'select':
                                return textExtension.properties.text.set({...data, element});
                        }

                        return Promise.reject("No Setter Found");
                    });
                });
            }
        }

    }
}
