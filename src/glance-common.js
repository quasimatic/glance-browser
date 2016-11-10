import log from 'loglevel'
import PromiseWrappedAdapter from "./promise-wrapped-adapter";
import PromiseUtils from './utils/promise-utils';
import TabManager from './utils/tab-manager';

import GlanceSelector from 'glance-selector';
import {DefaultExtensions, DefaultProperties} from 'glance-selector';
import {Parser} from 'glance-selector'

import Modifiers from "./utils/modifiers";

import Cast from './cast'

import defaultExtension from "./default-extension";
import DefaultSetter from "./extensions/default-setter";
import DefaultGetter from "./extensions/default-getter";

class GlanceCommon {
    constructor(config) {
        this.config = config.config || config;
        this.newInstance = config.newInstance || function (config = this.config) {
                return new GlanceCommon({...this, config});
            };

        this.promiseUtils = new PromiseUtils(new Promise((resolve, reject) => {
            this.setLogLevel(this.config.logLevel || 'info');

            if (config.browser) {
                this.defaultExtensions = [].concat([defaultExtension], DefaultExtensions);
                this.extensions = config.extensions || [];
                this.watchedSelectors = config.watchedSelectors || {};
                this.tabManager = config.tabManager || new TabManager(this);

                if (config.driver) {
                    this.browser = config.browser;
                    this.driver = config.driver;

                    resolve();
                }
                else {
                    this.browser = new PromiseWrappedAdapter(config.browser);
                    this.driver = config.browser.driver;

                    this.browser.init().then(resolve);
                }
            }
            else {
                console.log('A driver or driverConfig must be provided.');
                reject();
            }
        }), this.config);
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
        return this.promiseUtils.wrapPromise(this, () => {
            log.info("URL:", address);
            return this.browser.setUrl(address);
        });
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
        return this.promiseUtils.wrapPromise(this, () => {
            log.info("Cast:", JSON.stringify(state, null, "\t"));
            return new Cast({
                glance: this.newInstance(),
                logLevel: this.logLevel
            }).apply(state);
        });
    }

    //
    // Interactions
    //
    type(text) {
        return this.promiseUtils.wrapPromise(this, () => this.browser.type(text));
    }

    sendKeys(...keys) {
        return this.promiseUtils.wrapPromise(this, () => this.browser.sendKeys(...keys));
    }

    click(selector) {
        return this.promiseUtils.wrapPromise(this, () => {
            log.info("Click:", selector);
            return this.element(selector).then(element => {
                var g = this.newInstance();
                return g.execute(function (e) {
                    var p = e;
                    while (p && p.nodeType == 3) {
                        p = p.parentNode;
                    }
                    return p.nodeType + " - " + p.outerHTML;
                }, element).then(clickableElement => {
                    return g.browser.click(element);
                });
            });
        });
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
        return this.promiseUtils.wrapPromise(this, () => this.element(selector).then((wdioSelector) => this.browser.moveMouseTo(wdioSelector, xOffset, yOffset)));
    }

    mouseDown() {
        return this.promiseUtils.wrapPromise(this, () => this.browser.buttonDown(0));
    }

    mouseUp() {
        return this.promiseUtils.wrapPromise(this, () => this.browser.buttonUp(0));
    }

    dragAndDrop(sourceSelector, targetSelector, xOffset, yOffset) {
        return this.promiseUtils.wrapPromise(this, () => {
            log.info('Drag: "' + sourceSelector + '" and drop on "' + targetSelector + '"');
            return Promise.all([
                this.element(sourceSelector),
                this.element(targetSelector)
            ])
                .then(result => this.browser.dragAndDrop(result[0], result[1], xOffset, yOffset));
        });
    }

    pause(delay) {
        return this.promiseUtils.wrapPromise(this, () => {
            log.info("Pause:", `${delay}ms`);
            return this.browser.pause(delay);
        });
    }

    saveScreenshot(filename) {
        return this.promiseUtils.wrapPromise(this, () => {
            log.info("Save Screenshot:", filename);
            return this.browser.saveScreenshot(filename);
        });
    }

    closeTab(id) {
        return this.promiseUtils.wrapPromise(this, () => {
            log.info("Close tab");
            return this.browser.closeTab(id);
        });
    }

    scroll(selector) {
        return this.promiseUtils.wrapPromise(this, () => {
            log.info("Scroll to:", selector);
           return this.element(selector).then((wdioSelector) => this.browser.scroll(wdioSelector))
        });
    }

    //
    // Wait
    //
    waitFor(selector) {
        return this.promiseUtils.wrapPromise(this, () => {
            log.info("Wait for:", selector);
            return this.newInstance().find(selector);
        });
    }

    waitForChange(selector) {
        return this.promiseUtils.wrapPromise(this, () => {
            log.info("Wait for change:", selector);
            if (!this.watchedSelectors[selector] || this.watchedSelectors[selector].length == 0) {
                return Promise.reject('No saved value found. Please call "Save" for:', selector);
            }

            return this.promiseUtils.retryingPromise(() => {
                return this.newInstance({
                    ...this.config,
                    retryCount: 0,
                    logLevel: this.config.logLevel || 'error'
                })
                    .get(selector).then(result => {
                        if (result != this.watchedSelectors[selector][0]) {
                            return Promise.resolve({
                                newValue: result,
                                previousValue: this.watchedSelectors[selector][0]
                            });
                        }

                        return Promise.reject(`${selector} didn't change`);
                    });
            });
        });
    }

    save(selector) {
        return this.promiseUtils.wrapPromise(this, () => {
            log.info("Save:", selector);
            return this.newInstance({...this.config, retryCount: 0, logLevel: this.config.logLevel || 'error'})
                .get(selector).then(result => {
                    this.watchedSelectors[selector] = this.watchedSelectors[selector] || [];
                    this.watchedSelectors[selector].unshift(result);
                    return result;
                });
        });
    }

    getHistory(selector) {
        return this.promiseUtils.wrapPromise(this, () => {
            log.info("Get change:", selector);

            if (!this.watchedSelectors[selector] || this.watchedSelectors[selector].length == 0) {
                return Promise.reject('No saved value found. Please call "Save" for:', selector);
            }

            return Promise.resolve(this.watchedSelectors[selector]);
        });
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

    addLabel(label, details) {
        let customLabel = {labels: {}};
        customLabel.labels[label] = details;
        return this.addExtension(customLabel);
    }

    //
    // Getters and Setters
    //
    get(selector) {
        return this.promiseUtils.wrapPromise(this, () => {
            let data = Parser.parse(selector);
            let target = data[data.length - 1];
            var get = Modifiers.getGetter(target, this.extensions) || Modifiers.getGetter(target, this.defaultExtensions) || DefaultGetter.transforms.defaultgetter.get;

            log.info("Get:", selector);

            let g = this.newInstance();
            return g.browser.element("body").then(body => {
                return get({target, selector, glance: g, glanceSelector: this.internalGlanceSelector(g, body)});
            });
        });
    }

    set(selector, value) {
        return this.promiseUtils.wrapPromise(this, () => {
            let data = Parser.parse(selector);
            let target = data[data.length - 1];
            var set = Modifiers.getSetter(target, this.extensions) || Modifiers.getSetter(target, this.defaultExtensions) || DefaultSetter.transforms.defaultsetter.set;

            log.info('Set: "' + selector + '" to "' + value + '"');
            return set({target, selector, glance: this.newInstance(), value: value});
        });
    }

    //
    // Script excecution
    //
    execute(func, ...args) {
        return this.promiseUtils.wrapPromise(this, () => this.browser.execute(func, ...args));
    }

    executeAsync(func, ...args) {
        return this.promiseUtils.wrapPromise(this, () => this.browser.executeAsync(func, ...args));
    }

    //
    // Elements
    //
    element(selector, multiple) {
        var logLevel = this.logLevel;

        var g = this.newInstance();

        return new Promise((resolve, reject) => {
            g.browser.element("body").then(body => {
                try {
                    let gs = GlanceSelector(selector, {
                            glance: g,
                            glanceSelector: this.internalGlanceSelector(g, body),
                            defaultExtensions: this.defaultExtensions,
                            extensions: this.extensions,
                            browserExecute: this.config.browserExecute,
                            rootElement: body,
                            logLevel: logLevel,
                        },
                        (err, elements) => {
                            elements = [].concat(elements);

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
                                return g.execute(function (e) {
                                    return e.map(function (e) {
                                        return e.outerHTML;
                                    });
                                }, elements)
                                    .then((html) => {
                                        console.log(html);
                                        return reject('Found ' + elements.length + ' duplicates for: ' + selector);
                                    });
                            }

                            return reject("Element not found", selector);
                        });
                }
                catch (error) {
                    return reject(error);
                }
            });
        });
    }

    internalGlanceSelector(g, body) {
        var logLevel = this.logLevel;
        return (function (g, body) {
            return function (selector, handler) {
                return GlanceSelector(selector, {
                    glance: g,
                    glanceSelector: g.internalGlanceSelector(g, body),
                    defaultExtensions: g.defaultExtensions,
                    extensions: g.extensions,
                    browserExecute: g.config.browserExecute,
                    rootElement: body,
                    logLevel: logLevel,
                }, handler);
            }
        })(g, body);
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
