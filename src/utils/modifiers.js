export default class Modifiers {
	static getGetter(target, extensions) {
		let getters = [];
		let labels = Modifiers.labels(extensions);
		let transforms = Modifiers.transforms(extensions);
		let casts = Modifiers.cast(extensions);

		let validCasts = casts.filter(c => c.check({target}));

		if (validCasts.length > 0) {
			getters = casts.map(c => c.get);
		}
		else {
			if (labels[target.label] && labels[target.label].get)
				getters = getters.concat(labels[target.label].get);

			if (target.transform && transforms[target.transform] && transforms[target.transform].get)
				getters = getters.concat(transforms[target.transform].get);
		}

		return getters.length > 0 ? getters[getters.length - 1] : null;
	}

	static getSetter(target, extensions) {
		let setters = [];
		let labels = Modifiers.labels(extensions);
		let transforms = Modifiers.transforms(extensions);

		if (labels[target.label] && labels[target.label].set)
			setters = setters.concat(labels[target.label].set);

		if (target.transform && transforms[target.transform] && transforms[target.transform].set)
			setters = setters.concat(transforms[target.transform].set);

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