import '../utils/promise-utils'
import {
    getAttributeFromClient
} from '../utils/client';

export default  {
    cast: {
        check: function ({target}) {
            return target.transform && target.transform.indexOf("attribute-") > -1;
        },

        get: function (data) {
            var {selector, glance, target, element} = data;

            if (target.transform && target.transform.indexOf("attribute-") > -1) {
                let attribute = target.transform;
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