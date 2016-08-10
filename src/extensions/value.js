import '../utils/promise-utils'
import {
    getTagNameFromClient,
    getValueFromClient,
    getAttributeFromClient,
    checkboxValueFromClient,
    getSelectTextFromClient,
    setCheckboxValueFromClient,
    triggerChange
} from '../utils/client';

function getCheckbox({element, glance}) {
    return glance.browser.execute(getAttributeFromClient, element, "type").then(function (attributeType) {
        if (attributeType.toLowerCase() === "checkbox") {
            return glance.browser.execute(checkboxValueFromClient, element, name);
        }

        return Promise.reject();
    });
}

function getInput({element, glance}) {
    return glance.browser.getValue(element);
}

function setCheckbox({element, value, glance}) {
    return glance.browser.execute(getAttributeFromClient, element, "type").then(function (attributeType) {
        if (attributeType.toLowerCase() === "checkbox") {
            return glance.browser.execute(setCheckboxValueFromClient, element, value);
        }

        return Promise.reject();
    });
}

function setInput({element, value, glance}) {
    return glance.browser.setValue(element, value);
}

export default  {
    properties: {
        "value": {
            get: function (data) {
                var {selector, glance, target} = data;
                return glance.element(target.label).then((element)=> {
                    return glance.browser.execute(getTagNameFromClient, element).then(function (tagName) {
                        switch (tagName.toLowerCase()) {
                            case "input":
                                return [
                                    getCheckbox,
                                    getInput
                                ].firstResolved(strategy => strategy({...data, element}));

                            case "select":
                                //return glance.browser.execute(getSelectTextFromClient, element);
                                return glance.browser.execute(getValueFromClient, element);

                        }

                        return Project.reject("No value to get");
                    });
                });
            },

            set: function (data) {
                let {selector, glance, target, value} = data
                return glance.element(target.label).then((element)=> {
                    return glance.browser.execute(getTagNameFromClient, element).then(function (tagName) {
                        if (tagName.toLowerCase() == "input") {
                            return [
                                setCheckbox,
                                setInput
                            ].firstResolved(strategy => strategy({...data, element, value})).then(result => {
                                return glance.browser.execute(triggerChange, element).then(changed => result);
                            });
                        }

                        return Project.reject("No value to set");
                    });
                });
            }
        }
    }
}