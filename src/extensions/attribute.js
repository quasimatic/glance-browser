import '../utils/promise-utils'
import {
    getAttributeFromClient
} from '../utils/client';

export default  {
    cast: {
        check: function ({target}) {
            let attributes = target.transforms.filter(p => p.indexOf("attribute-") > -1);
            return attributes.length > 0;
        },

        get: function (data) {
            var {selector, glance, target, element} = data;

            let attributes = target.transforms.filter(p => p.indexOf("attribute-") > -1);

            if (attributes.length > 0) {
                let attribute = attributes[attributes.length - 1];
                let key = attribute.slice("attribute-".length);

                var elementPromise = element ? Promise.resolve(element) : glance.element(selector);

                return elementPromise.then((e) => {
                    return glance.browser.execute(getAttributeFromClient, e, key);
                });
            }

            return Promise.resolve();
        },

        set: function (data) {
            return Promise.reject("Can't set attribute at this time");
        }
    }
}