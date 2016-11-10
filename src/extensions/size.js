export default  {
    transforms: {
        "size": {
            get: function ({glance, target}) {
                if (target.label != "browser" || target.transforms.length != 1)
                    return Promise.reject('Label must be "browser" and have a property');

                switch (target.transforms[target.transforms.length - 1]) {
                    case "size":
                        return glane.browser.getWindowSize();
                }

                return Promise.reject(`${target.transforms[0]} not a valid property to get for browser`);
            },

            set: function ({target, value, glance}) {
                if (target.label != "browser" || target.transforms.length != 1)
                    return Promise.reject('Label must be "browser" and have a property');

                switch (target.transforms[target.transforms.length - 1]) {
                    case "size":
                        if(typeof(value) == "string") {
                            if(value == "maximize") {
                                return glance.browser.maximize();
                            }
                        }
                        else {
                            return glance.browser.setWindowSize(value);
                        }
                }
            }
        }
    }
}