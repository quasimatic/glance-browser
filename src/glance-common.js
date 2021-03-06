import log from 'loglevel';
import PromiseWrappedAdapter from './promise-wrapped-adapter';
import PromiseUtils from './utils/promise-utils';
import TabManager from './utils/tab-manager';
import FluentPromises from 'fluent-promises';

import glanceDOM from 'glance-dom';

import Modifiers from './utils/modifiers';

import Cast from './cast';

import defaultExtension from './default-extension';
import DefaultSetter from './extensions/default-setter';
import DefaultGetter from './extensions/default-getter';

let Parser = glanceDOM.parser;

class GlanceCommon  extends FluentPromises {
	constructor(config) {
		super();
		this.config = config.config || config;
		this.newInstance = config.newInstance || function(config = this.config) {
				return new GlanceCommon({...this, config});
			};

		new Promise((resolve, reject) => {
			this.promiseUtils = new PromiseUtils(this.config);
			this.setLogLevel(this.config.logLevel || 'info');

			if (config.browser) {
				this.defaultExtensions = [].concat([defaultExtension]);//, DefaultExtensions);
				this.extensions = config.extensions || [];
				this.watchedSelectors = config.watchedSelectors || {};

				if (config.driver) {
					this.browser = config.browser;
					this.driver = config.driver;
					glanceDOM.setExecute((...args) => this.browser.execute.apply(this.browser, args));
					this.glanceDOM = glanceDOM;

					resolve();
				}
				else {
					this.browser = new PromiseWrappedAdapter(config.browser);
					this.driver = config.browser.driver;

					glanceDOM.setExecute((...args) => this.browser.execute.apply(this.browser, args));
					this.glanceDOM = glanceDOM;

					this.browser.init().then(resolve);
				}
				this.tabManager = config.tabManager || new TabManager(this.browser);
			}
			else {
				console.log('A driver or driverConfig must be provided.');
				reject('A driver or driverConfig must be provided.');
			}
		});
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
		return this.wrap(() => {
			if (address) {
				log.info('Set URL:', address);
				return this.browser.setUrl(address);
			}
			else {
				log.info('Get URL');
				return this.browser.getUrl();
			}
		});
	}

	end() {
		return this.wrap(() => this.browser.end());
	}

	find(selector) {
		return this.wrap(() => this.element(selector, true));
	}

	//
	// Cast
	//
	cast(state) {
		return this.wrap(() => {
			log.info('Cast:', JSON.stringify(state, null, '\t'));
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
		return this.wrap(() => this.browser.type(text));
	}

	sendKeys(...keys) {
		return this.wrap(() => this.browser.sendKeys(...keys));
	}

	click(selector) {
		return this.wrap(() => {
			log.info('Click:', selector);
			return this.element(selector).then(element => this.browser.click(element));
		});
	}

	doubleClick(selector) {
		return this.wrap(() => this.element(selector).then((wdioSelector) => this.browser.doubleClick(wdioSelector)));
	}

	middleClick(selector) {
		return this.wrap(() => this.element(selector).then((wdioSelector) => this.browser.middleClick(wdioSelector)));
	}

	rightClick(selector) {
		return this.wrap(() => this.element(selector).then((wdioSelector) => this.browser.rightClick(wdioSelector)));
	}

	moveMouseTo(selector, xOffset, yOffset) {
		return this.wrap(() => this.element(selector).then((wdioSelector) => this.browser.moveMouseTo(wdioSelector, xOffset, yOffset)));
	}

	mouseDown() {
		return this.wrap(() => this.browser.buttonDown(0));
	}

	mouseUp() {
		return this.wrap(() => this.browser.buttonUp(0));
	}

	dragAndDrop(sourceSelector, targetSelector, xOffset, yOffset) {
		return this.wrap(() => {
			log.info('Drag: "' + sourceSelector + '" and drop on "' + targetSelector + '"');
			return Promise.all([
				this.element(sourceSelector),
				this.element(targetSelector)
			])
				.then(result => this.browser.dragAndDrop(result[0], result[1], xOffset, yOffset));
		});
	}

	pause(delay) {
		return this.wrap(() => {
			log.info('Pause:', `${delay}ms`);
			return this.browser.pause(delay);
		});
	}

	saveScreenshot(filename) {
		return this.wrap(() => {
			log.info('Save Screenshot:', filename);
			return this.browser.saveScreenshot(filename);
		});
	}

	closeTab(id) {
		return this.wrap(() => {
			log.info('Close tab');
			return this.browser.closeTab(id);
		});
	}

	scroll(selector) {
		return this.wrap(() => {
			log.info('Scroll to:', selector);
			return this.element(selector).then((wdioSelector) => this.browser.scroll(wdioSelector));
		});
	}

	//
	// Wait
	//
	waitFor(selector) {
		return this.wrap(() => {
			log.info('Wait for:', selector);
			return this.newInstance().find(selector);
		});
	}

	waitForChange(selector) {
		return this.wrap(() => {
			log.info('Wait for change:', selector);
			if (!this.watchedSelectors[selector] || this.watchedSelectors[selector].length === 0) {
				return Promise.reject('No saved value found. Please call "Save" for:', selector);
			}

			return this.promiseUtils.retryingPromise(() => {
				return this.newInstance({
					...this.config,
					retryCount: 0,
					logLevel: this.config.logLevel || 'error'
				})
					.get(selector).then(result => {
						if (result !== this.watchedSelectors[selector][0]) {
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
		return this.wrap(() => {
			log.info('Save:', selector);
			return this.newInstance({...this.config, retryCount: 0, logLevel: this.config.logLevel || 'error'})
				.get(selector).then(result => {
					this.watchedSelectors[selector] = this.watchedSelectors[selector] || [];
					this.watchedSelectors[selector].unshift(result);
					return result;
				});
		});
	}

	getHistory(selector) {
		return this.wrap(() => {
			log.info('Get change:', selector);

			if (!this.watchedSelectors[selector] || this.watchedSelectors[selector].length === 0) {
				return Promise.reject('No saved value found. Please call "Save" for:', selector);
			}

			return Promise.resolve(this.watchedSelectors[selector]);
		});
	}

	//
	// Extensions
	//
	addExtension(extension) {
		return this.wrap(() => {
			this.extensions.push(extension);
			this.glanceDOM.addExtension(extension);
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
		return this.wrap(() => {
			log.info('Get:', selector);
			let castCharIndex = selector.lastIndexOf(':');
			let reference = selector;
			let transform = null;

			if (castCharIndex !== -1) {
				reference = selector.slice(0, castCharIndex);
				transform = selector.slice(castCharIndex + 1);
			}

			let data = Parser.parse(reference);
			let target = data[data.length - 1][0];
			target.transform = transform;

			let get = Modifiers.getGetter(target, this.extensions) || Modifiers.getGetter(target, this.defaultExtensions) || DefaultGetter.transforms.defaultgetter.get;

			let g = this.newInstance();
			return get({target, selector: reference, glance: g, glanceDOM: this.internalGlanceDOM(g)});
		});
	}

	set(selector, value) {
		return this.wrap(() => {
			log.info('Set: "' + selector + '" to "' + value + '"');

			let castCharIndex = selector.lastIndexOf(':');
			let reference = selector;
			let transform = null;

			if (castCharIndex !== -1) {
				reference = selector.slice(0, castCharIndex);
				transform = selector.slice(castCharIndex + 1);
			}

			let data = Parser.parse(reference);
			let target = data[data.length - 1][0];
			target.transform = transform;

			let set = Modifiers.getSetter(target, this.extensions) || Modifiers.getSetter(target, this.defaultExtensions) || DefaultSetter.transforms.defaultsetter.set;

			return set({target, selector: reference, glance: this.newInstance(), value: value});
		});
	}

	//
	// Script excecution
	//
	execute(func, ...args) {
		return this.wrap(() => this.browser.execute(func, ...args));
	}

	executeAsync(func, ...args) {
		return this.wrap(() => this.browser.executeAsync(func, ...args));
	}

	perform(actionFunc) {
		let g = this.newInstance({...this.config, retryCount: 0});
		return this.wrap(() => actionFunc(g));
	}

	//
	// Elements
	//
	element(selector, multiple) {
		let logLevel = this.logLevel;

		let g = this.newInstance();

		let glanceDOM = this.glanceDOM;

		return new Promise((resolve, reject) => {
			glanceDOM(selector, {advanced: true, logLevel}).then(result => {
				if (result.logs.length > 0) result.logs.forEach(l => console.log(l));
				let elements = result.elements;

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
					return g.execute(function(e) {
						return e.map(function(e) {
							return e.outerHTML;
						});
					}, elements)
						.then((html) => {
							console.log(html);
							return reject('Found ' + elements.length + ' duplicates for: ' + selector);
						});
				}

				return reject('Element not found', selector);
			}, reject);
		});
	}

	internalGlanceDOM(g) {
		let logLevel = this.logLevel;
		let glanceDOM = this.glanceDOM;
		return function(selector) {
			return glanceDOM(selector, {advanced: true, logLevel: logLevel});
		};
	}

	wrap(func) {
		return this.makeFluent(() => {
			return this.promiseUtils.retryingPromise(() => {
				return this.tabManager.ensureLatestTab().then(func);
			});
		});
	}
}

export {Cast};

export default GlanceCommon;
