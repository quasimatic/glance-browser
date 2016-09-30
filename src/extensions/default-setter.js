import valueExtension from "./value";
import textExtension from "./text";

import '../utils/promise-utils'
import {
    getTagNameFromClient
} from '../utils/client';

export default {
    transforms: {
        defaultsetter: {
            set: function (data) {
                let {selector, glance, target, value, element} = data
                var elementPromise = element ? Promise.resolve(element) : glance.element(selector);

                return elementPromise.then((element)=> {
                    return glance.browser.execute(getTagNameFromClient, element).then(function (tagName) {
                        switch (tagName.toLowerCase()) {
                            case 'input':
                            case 'textarea':
                                return valueExtension.transforms.value.set({...data, element});

                            case 'select':
                                return textExtension.transforms.text.set({...data, element});
                        }

                        return Promise.reject("No Setter Found");
                    });
                });
            }
        }

    }
}
