export default class Modifiers {
    static getGetter(target, extensions) {
        let getters = [];
        let labels = Modifiers.labels(extensions);
        let properties = Modifiers.properties(extensions);

        if (labels[target.label] && labels[target.label].get) {
            getters = getters.concat(labels[target.label].get);
        }

        if (target.properties.length > 0) {
            let propertiesWithGetters = target.properties.filter(name => {
                console.log(name, properties[name])
                return properties[name] && properties[name].get
            });

            console.log(propertiesWithGetters.length)
            if (propertiesWithGetters.length != 0) {
                getters = getters.concat(propertiesWithGetters.map(name => properties[name].get));
            }
        }

        return getters.length > 0 ? getters[getters.length - 1] : null;
    }

    static getSetter(target, extensions) {
        let setters = [];
        let labels = Modifiers.labels(extensions);
        let properties = Modifiers.properties(extensions);

        if (labels[target.label] && labels[target.label].set) {
            setters = setters.concat(labels[target.label].set);
        }

        if (target.properties.length > 0) {
            let propertiesWithSetters = target.properties.filter(name => properties[name] && (properties[name].set));

            if (propertiesWithSetters.length != 0) {
                setters = setters.concat(propertiesWithSetters.map(name => properties[name].set));
            }
        }

        return setters.length > 0 ? setters[setters.length - 1] : null;
    }

    static labels(extensions) {
        return extensions.filter(e => e.labels).reduce((m, e) => ({...m, ...e.labels}), {});
    }

    static properties(extensions) {
        return extensions.filter(e => e.properties).reduce((m, e) => {
            var properties = Object.keys(e.properties).reduce((r, k) => {
                let t = {};
                let n = {};
                if (typeof(m[k]) == 'function') {
                    t.filter = m[k];
                }
                else{
                    t = m[k];
                }

                if (typeof(e.properties[k]) == 'function') {
                    n.filter = e.properties[k];
                }
                else{
                    n = e.properties[k];
                }

                r[k] = {...t, ...n};

                return r;
            }, {})
            return ({...m, ...properties})
        }, {});
    }
}