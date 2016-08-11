import '../utils/promise-utils'
import {
    getTagNameFromClient,
    getHTMLFromClient
} from '../utils/client';

export default  {
    properties: {
        "html": {
            get: function (data) {
                var {selector, glance, target, element} = data;
                var elementPromise = element? Promise.resolve(element) : glance.element(selector);

                return elementPromise.then((element)=> {
                    return glance.browser.execute(getTagNameFromClient, element);
                });
            },

            set: function (data) {
                return Promise.reject("No value to set");
            }
        }
    }
}