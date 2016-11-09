export default  {
    transforms: {
        "title": {
            get: function ({glance, target}) {
                if (target.label != "browser" || target.transforms.length != 1)
                    return Promise.reject('Label must be "browser" and have a property');

                switch (target.transforms[target.transforms.length - 1]) {
                    case "title":
                        return glance.browser.getTitle();
                }

                return Promise.reject(`${target.transforms[0]} not a valid property to get for browser`);
            },

            set: function (data) {
                return Promise.reject("Can't set title");
            }
        }
    }
}