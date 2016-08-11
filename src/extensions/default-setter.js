import valueExtension from "./value";

import '../utils/promise-utils'
import {
    getTagNameFromClient
} from '../utils/client';

export default {
    properties: {
        defaultsetter: {
            set: function (data) {
                let {selector, glance, target, value} = data
                return glance.element(selector).then((element)=> {
                    return glance.browser.execute(getTagNameFromClient, element).then(function (tagName) {
                        switch (tagName.toLowerCase()) {
                            case "input":
                                return valueExtension.properties.value.set(data);
                        }

                        return Promise.reject("No Getter Found");
                    });
                });
            }
        }

    }
}
