export default class Modifiers {
    static getGetter(target, extensions) {
        let getters = [];
        let labels = Modifiers.labels(extensions);
        let transforms = Modifiers.transforms(extensions);
        let casts = Modifiers.cast(extensions);

        var validCasts = casts.filter(c => c.check({target}));

        if (validCasts.length > 0) {
            getters = casts.map(c => c.get);
        }
        else {
            if (labels[target.label] && labels[target.label].get) {
                getters = getters.concat(labels[target.label].get);
            }

            if (target.transforms.length > 0) {
                let transformsWithGetters = target.transforms.filter(name => transforms[name] && transforms[name].get);

                if (transformsWithGetters.length !== 0) {
                    getters = getters.concat(transformsWithGetters.map(name => transforms[name].get));
                }
            }
        }

        return getters.length > 0 ? getters[getters.length - 1] : null;
    }

    static getSetter(target, extensions) {
        let setters = [];
        let labels = Modifiers.labels(extensions);
        let transforms = Modifiers.transforms(extensions);

        if (labels[target.label] && labels[target.label].set) {
            setters = setters.concat(labels[target.label].set);
        }

        if (target.transforms.length > 0) {
            let transformsWithSetters = target.transforms.filter(name => transforms[name] && (transforms[name].set));

            if (transformsWithSetters.length !== 0) {
                setters = setters.concat(transformsWithSetters.map(name => transforms[name].set));
            }
        }

        return setters.length > 0 ? setters[setters.length - 1] : null;
    }

    static labels(extensions) {
        return extensions.filter(e => e.labels).reduce((m, e) => ({...m, ...e.labels}), {});
    }

    static transforms(extensions) {
        return extensions.filter(e => e.transforms).reduce((m, e) => ({...m, ...e.transforms}), {});
    }

    static cast(extensions) {
        return extensions.filter(e => e.cast).map((e) => e.cast);
    }
}