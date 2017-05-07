import log from 'loglevel';

let resolveSeries = function(array, func) {
	return array.reduce((p1, next) => p1.then(() => func(next)), Promise.resolve());
};

let firstResolved = function(array, func) {
	return array.reduce((p1, next) => p1.catch(() => func(next)), Promise.reject());
};

function delay(ms) {
	return new Promise((resolve, reject) => {
		setTimeout(resolve, ms);
	});
}

export default class PromiseUtils {
	constructor(promise, config) {
		this.promise = promise;
		this.config = Object.assign({
			retryCount: 3,
			retryDelay: 500
		}, config || {});
	}

	retryingPromise(func, attempt = 1) {
		var retryCount = this.config.retryCount;
		var retryDelay = this.config.retryDelay;

		return func().catch((reason) => {
			if (attempt <= retryCount) {
				let delayAmount = attempt * retryDelay;
				log.debug('Retrying with delay:', delayAmount);
				return delay(delayAmount).then(() => this.retryingPromise(func, ++attempt));
			}
			else {
				log.debug('Retries failed:', reason);
				log.warn(reason);
				throw new Error(reason);
			}
		});
	}
}

export {resolveSeries, firstResolved, PromiseUtils};