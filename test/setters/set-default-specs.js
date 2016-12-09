import dom from "../dom"
import createGlance from '../mock-glance';

import {
    getTagNameFromClient,
    getOptionFromText,
    getAttributeFromClient,
    setCheckboxValueFromClient,
    setSelectByTextOnClient,
    triggerChange

} from '../../src/utils/client';

describe("Set: default", function () {
    this.timeout(10000);

    let glance;
    let browser;

    beforeEach(function () {
        document.body.innerHTML = "";

        let mock = createGlance();
        glance = mock.glance;
        browser = mock.browser;
    });

    it("should set text for an input value", function () {
        dom.render(<input id="target" value="value 1"/>);

        browser.execute.withArgs(getTagNameFromClient).returns("input");

        return glance.set("input", "changed value").then(() => {
            return browser.setValue.should.have.been.calledWith(dom.get('target'), "changed value");
        })
    });

    it("should set a checkbox value", function () {
        dom.render(<input id="target" type="checkbox" checked/>);

        browser.execute.withArgs(getTagNameFromClient).returns("input");
        browser.execute.withArgs(getAttributeFromClient).returns("checkbox");
        browser.execute.withArgs(triggerChange).returns(true);
        browser.execute.withArgs(setCheckboxValueFromClient).returns(true);

        return glance.set("input", true).then(function (value) {
            return value.should.equal(true);
        });
    });

    it("should set a select by text", function () {
        dom.render(<select>
            <option value="value 1">text 1</option>
            <option value="value 2">text 2</option>
            <option value="value 3">text 3</option>
        </select>);

        browser.execute.withArgs(getTagNameFromClient).returns("select");
        browser.execute.withArgs(getOptionFromText).returns("text 2");

        return glance.set("select", "text 2").then(function (value) {
            return value.should.equal("text 2");
        });
    });

    it("should set input value for a custom label", function () {
        dom.render(<div>
            <input value="value 1"/>
            <input id="target" value="value 2"/>
            <input value="value 3"/>
        </div>);

        glance.addExtension({
            labels: {
                "custom-input": function({glance}, callback) {
                    return glance.find("target").then(result => callback(null, result));
                }
            }
        });

        browser.execute.withArgs(getTagNameFromClient).returns("input");

        return glance.set("custom-input", "changed value").then(() => {
            return browser.setValue.should.have.been.calledWith(dom.get('target'), "changed value");
        });
    });
});