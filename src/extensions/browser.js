export default  {
    properties: {
        "url": {
            get: function (data) {
                let {selector, glance, target} = data;

                if (target.label != "browser" || target.properties.length != 1)
                    return Promise.reject('Label must be "browser" and have a property');

                switch (target.properties[0]) {
                    case "url":
                        return glance.browser.getUrl();
                    case "tabs":
                        return glance.browser.getTabs();
                    case "activetab":
                        return glance.browser.getActiveTab();
                }

                return Promise.reject(`${target.properties[0]} not a valid property to get for browser`);
            },

            set: function ({target}) {
                if (target.label == "browser") {
                    return Promise.reject("No setters for browser")
                }
            }
        }
    }
}