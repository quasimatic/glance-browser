export default  {
    transforms: {
        "url": {
            get: function ({glance, target}) {
                if (target.label != "browser" || target.transforms.length != 1)
                    return Promise.reject('Label must be "browser" and have a property');

                switch (target.transforms[target.transforms.length - 1]) {
                    case "url":
                        return glance.browser.getUrl();
                    case "tabs":
                        return glance.browser.getTabs();
                    case "activetab":
                        return glance.browser.getActiveTab();
                }

                return Promise.reject(`${target.transforms[0]} not a valid property to get for browser`);
            },

            set: function ({target, value, glance}) {
                if (target.label != "browser" || target.transforms.length != 1)
                    return Promise.reject('Label must be "browser" and have a property');

                switch (target.transforms[target.transforms.length - 1]) {
                    case "url":
                        return glance.browser.setUrl(value);
                    case "activetab":
                        return glance.browser.setActiveTab(value);
                }
            }
        }
    }
}