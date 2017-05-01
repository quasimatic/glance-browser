export default  {
    transforms: {
        "url": {
            get: function ({glance, target}) {
                if (target.label != "browser" || !target.transform)
                    return Promise.reject('Label must be "browser" and have a property');

                switch (target.transform) {
                    case "url":
                        return glance.browser.getUrl();
                    case "tabs":
                        return glance.browser.getTabs();
                    case "activetab":
                        return glance.browser.getActiveTab();
                }

                return Promise.reject(`${target.transform} not a valid property to get for browser`);
            },

            set: function ({target, value, glance}) {
                if (target.label != "browser" || !target.transform)
                    return Promise.reject('Label must be "browser" and have a property');

                switch (target.transform) {
                    case "url":
                        return glance.browser.setUrl(value);
                    case "activetab":
                        return glance.browser.setActiveTab(value);
                }
            }
        }
    }
}