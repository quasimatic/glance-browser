export default  {
    transforms: {
        "title": {
            get: function ({glance, target}) {
                if (target.label != "browser" || !target.transform)
                    return Promise.reject('Label must be "browser" and have a property');

                switch (target.transform) {
                    case "title":
                        return glance.browser.getTitle();
                }

                return Promise.reject(`${target.transform} not a valid property to get for browser`);
            },

            set: function (data) {
                return Promise.reject("Can't set title");
            }
        }
    }
}