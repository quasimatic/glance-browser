import log from 'loglevel'
import PromiseWrappedDriver from "./promise-wrapped-driver";
import PromiseUtils from './utils/promise-utils'

import GlanceSelector from 'glance-selector';
import {Parser} from 'glance-selector'

import Modifiers from "./utils/modifiers";

import Cast from './cast'
import defaultGetter from './getters/default-getter';
import defaultSetter from './setters/default-setter';

import defaultExtension from "./default-extension";

class GlanceCommon {
    constructor(config) {
        this.config = config.config || config;
        this.promiseUtils = new PromiseUtils(new Promise((resolve, reject) => {
            if (config.logLevel) {
                this.setLogLevel(config.logLevel);
            }

            if (config.browser) {
                this.extensions = config.extensions || [defaultExtension];
                this.browser = new PromiseWrappedDriver(config.browser);
                this.driver = this.browser.driver;

                this.browser.init().then(resolve);
            }
            else {
                console.log('A driver or driverConfig must be provided.');
                reject();
            }
        }), this.config);
    }

    newInstance() {
        return new GlanceCommon(this);
    }

    parse(selector) {
        return Parser.parse(selector);
    }

    setLogLevel(level) {
        log.setLevel(level);
        this.logLevel = level;
        return this;
    }

    url(address) {
        return this.promiseUtils.wrapPromise(this, () => this.browser.setUrl(address));
    }

    end() {
        return this.promiseUtils.wrapPromise(this, () => this.browser.end());
    }

    find(selector) {
        return this.promiseUtils.wrapPromise(this, () => this.element(selector, true));
    }

    //
    // Cast
    //
    cast(state) {
        return this.promiseUtils.wrapPromise(this, () => new Cast(new Glance(this)).apply(state));
    }

    //
    // Interactions
    //
    type(text) {
        return this.promiseUtils.wrapPromise(this, () => this.browser.keys(text));
    }

    click(selector) {
        return this.promiseUtils.wrapPromise(this, () => this.element(selector).then((element) => {
            log.info('Clicking:', selector);
            return this.browser.click(element);
        }));
    }

    doubleClick(selector) {
        return this.promiseUtils.wrapPromise(this, () => this.element(selector).then((wdioSelector) => this.browser.doubleClick(wdioSelector)));
    }

    middleClick(selector) {
        return this.promiseUtils.wrapPromise(this, () => this.element(selector).then((wdioSelector) => this.browser.middleClick(wdioSelector)));
    }

    rightClick(selector) {
        return this.promiseUtils.wrapPromise(this, () => this.element(selector).then((wdioSelector) => this.browser.rightClick(wdioSelector)));
    }

    moveMouseTo(selector, xOffset, yOffset) {
        return this.promiseUtils.wrapPromise(this, () => this.element(selector).then((wdioSelector) => this.browser.moveToObject(wdioSelector, xOffset, yOffset)));
    }

    mouseDown() {
        return this.promiseUtils.wrapPromise(this, () => this.browser.buttonDown(0));
    }

    mouseUp() {
        return this.promiseUtils.wrapPromise(this, () => this.browser.buttonUp(0));
    }

    dragAndDrop(sourceSelector, targetSelector, xOffset, yOffset) {
        return this.promiseUtils.wrapPromise(this, () => {
            return Promise.all([
                this.element(sourceSelector),
                this.element(targetSelector)
            ])
                .then(result => this.browser.dragAndDrop(result[0], result[1], xOffset, yOffset));
        });
    }

    pause(delay) {
        return this.promiseUtils.wrapPromise(this, () => this.browser.pause(delay));
    }

    saveScreenshot(filename) {
        return this.promiseUtils.wrapPromise(this, () => this.browser.saveScreenshot(filename));
    }

    //
    // Extensions
    //
    addExtension(extension) {
        return this.promiseUtils.wrapPromise(this, () => {
            this.extensions.push(extension);
            return Promise.resolve();
        });
    }

    //
    // Getters and Setters
    //
    get(selector) {
        return this.promiseUtils.wrapPromise(this, () => {
            let data = Parser.parse(selector);
            let target = data[data.length - 1];
            var get = Modifiers.getGetter(target, this.extensions) || defaultGetter;

            return get(selector, {glance: this.newInstance()});
        });
    }

    set(selector, ...values) {
        return this.promiseUtils.wrapPromise(this, () => {
            let data = Parser.parse(selector);
            let target = data[data.length - 1];
            var set = Modifiers.getSetter(target, this.extensions) || defaultSetter;

            return set(selector, values, {glance: this.newInstance()});
        });
    }

    //
    // Script excecution
    //
    execute(func, ...args) {
        return this.promiseUtils.wrapPromise(this, () => this.browser.execute(func, ...args));
    }

    //
    // Elements
    //
    element(selector, multiple) {
        var logLevel = this.logLevel;

        return new Promise((resolve, reject) => {
            Promise.resolve(this.browser.element("body")).then(body => {
                var g = this;

                try {
                    GlanceSelector(selector, {
                            glance: g,
                            extensions: this.extensions,
                            execute: this.config.execute,
                            rootElement: body
                        },
                        function (err, elements) {
                            elements = [].concat(elements);

                            //g.browser.log('browser').then(function (logs) {
                            //   log.debug('CLIENT:', logs.map(l => l.message).join('\n').replace(/ \(undefined:undefined\)/g, ''));

                            if (elements.length === 0) {
                                return reject('Element not found: ' + selector);
                            }

                            if (elements.length === 1) {
                                return resolve(elements[0]);
                            }

                            if (multiple) {
                                return resolve(elements);
                            }

                            if (elements.length > 1) {
                                console.log('Found ' + elements.length + ' duplicates for: ' + selector);
                                return reject('Found ' + elements.length + ' duplicates for: ' + selector);
                            }

                            return reject("Element not found", selector);
                            // }, function (reason) {
                            //     reject(reason);
                            // });
                        });
                }
                catch (err) {
                    console.log("ERROR:", err)
                }
            });
        });
    }

    //
    // Promise handlers
    //
    then(onFulfilled, onRejected) {
        onFulfilled = onFulfilled || function (value) {
                return Promise.resolve(value);
            };

        onRejected = onRejected || function (reason) {
                return Promise.reject(reason);
            };

        var g = this;
        return this.promiseUtils.waitForThen(g, function (value) {
                g.promiseUtils.setPromise(Promise.resolve());
                return Promise.resolve(onFulfilled(value));
            },
            function (reason) {
                g.promiseUtils.setPromise(Promise.resolve());
                return Promise.resolve(onRejected(reason));
            });
    }

    catch(onRejected) {
        onRejected = onRejected || function (reason) {
                return Promise.reject(reason);
            };

        var g = this;
        return this.promiseUtils.waitForCatch(g, function (reason) {
            g.promiseUtils.setPromise(Promise.resolve());
            return Promise.resolve(onRejected(reason));
        });
    }
}

export {Cast}

export default GlanceCommon
