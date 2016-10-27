import log from "loglevel";

let resolveSeries = function (array, func) {
    return array.reduce((p1, next)=> p1.then(() => func(next)), Promise.resolve());
};

let firstResolved = function (array, func) {
    return array.reduce((p1, next)=> p1.catch(() => func(next)), Promise.reject());
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

    setPromise(promise) {
        this.promise = promise;
    }

    retryingPromise(func, attempt = 1) {
        var retryCount = this.config.retryCount;
        var retryDelay = this.config.retryDelay;

        return func().catch((reason) => {
            if (attempt <= retryCount) {
                let delayAmount = attempt * retryDelay;
                log.debug("Retrying with delay:", delayAmount)
                return delay(delayAmount).then(() => this.retryingPromise(func, ++attempt))
            }
            else {
                log.debug("Retries failed:", reason)
                log.warn(reason)
                throw new Error(reason);
            }
        });
    }

    wrapPromise(glance, func) {
        return glance.promiseUtils.waitForThen(glance, function () {
            return glance.tabManager.ensureLatestTab().then(function(){
                return glance.promiseUtils.retryingPromise(func);
            });
        });
    }

    waitForThen(glance, resolve, reject) {
        reject = reject || function (reason) {
                return Promise.reject(reason)
            };

        this.promise = this.promise.then((value)=> resolve.call(glance.newInstance(), value), (reason)=>reject.call(glance.newInstance(), reason));

        return glance;
    }

    waitForCatch(glance, reject) {
        this.promise = this.promise.catch((reason)=> reject.call(glance.newInstance(), reason));
        return glance;
    }
}

export {resolveSeries, firstResolved, PromiseUtils}