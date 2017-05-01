import {firstResolved} from '../utils/promise-utils';
import {
	getTagNameFromClient,
	getAttributeFromClient,
	checkboxValueFromClient,
	getSelectValueFromClient,
	setCheckboxValueFromClient,
	getTextareaValueFromClient,
	setTextareaValueFromClient,
	triggerChange,
	getOptionFromValue
} from '../utils/client';

function getCheckbox({element, glance}) {
	return glance.browser.execute(getAttributeFromClient, element, 'type').then(function(attributeType) {
		if (attributeType.toLowerCase() === 'checkbox') {
			return glance.browser.execute(checkboxValueFromClient, element, name);
		}

		return Promise.reject();
	});
}

function getInput({element, glance}) {
	return glance.browser.getValue(element);
}

function setCheckbox({element, value, glance}) {
	return glance.browser.execute(getAttributeFromClient, element, 'type').then(function(attributeType) {
		if (attributeType.toLowerCase() === 'checkbox') {
			return glance.browser.execute(setCheckboxValueFromClient, element, value);
		}

		return Promise.reject();
	});
}

function setInput({element, value, glance}) {
	return glance.browser.setValue(element, value);
}

export default  {
	transforms: {
		'value': {
			get: function(data) {
				var {selector, glance, target, element} = data;
				var elementPromise = element ? Promise.resolve(element) : glance.element(selector);

				return elementPromise.then((element) => {
					return glance.browser.execute(getTagNameFromClient, element).then(function(tagName) {
						switch (tagName.toLowerCase()) {
							case 'input':
								return firstResolved([
									getCheckbox,
									getInput
								], strategy => strategy({...data, element}));

							case 'textarea':
								return glance.browser.execute(getTextareaValueFromClient, element);

							case 'select':
								return glance.browser.execute(getSelectValueFromClient, element);
						}

						return Promise.reject('No value to get');
					});
				});
			},

			set: function(data) {
				let {selector, glance, target, value, element} = data;
				let stringValue = value.toString();
				var elementPromise = element ? Promise.resolve(element) : glance.element(selector);

				return elementPromise.then((element) => {
					return glance.browser.execute(getTagNameFromClient, element).then(function(tagName) {
						switch (tagName.toLowerCase()) {
							case 'input':
								return firstResolved([
									setCheckbox,
									setInput
								], strategy => strategy({...data, element, value:stringValue})).then(result => {
									return glance.browser.execute(triggerChange, element).then(changed => result);
								});

							case 'textarea':
								return glance.browser.execute(setTextareaValueFromClient, element, stringValue).then(result => {
									return glance.browser.execute(triggerChange, element).then(changed => result);
								});

							case 'select':
								return glance.browser.execute(getOptionFromValue, element, stringValue).then(result => {
									return glance.browser.click(result).then(() => glance.browser.execute(triggerChange, element).then(changed => result));
								});
						}

						return Promise.reject('No setter for ' + selector);
					});
				});
			}
		}
	}
};