import dom from "../dom"
import createGlance from '../mock-glance';

import {
    getTagNameFromClient,
    getTextFromClient,
    getAttributeFromClient,
    setCheckboxValueFromClient,
    triggerChange

} from '../../src/utils/client';

describe("Set: value", function () {
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

        return glance.set("input:value", "changed value").then(() => {
            return browser.setValue.should.have.been.calledWith(dom.get('target'), "changed value");
        })
    });

    it("should set a checkbox value", function () {
        dom.render(<input id="target" type="checkbox" checked/>);

        browser.execute.withArgs(getTagNameFromClient).returns("input");
        browser.execute.withArgs(getAttributeFromClient).returns("checkbox");
        browser.execute.withArgs(triggerChange).returns(true);
        browser.execute.withArgs(setCheckboxValueFromClient).returns(true);

        return glance.set("input:value", true).then(function (value) {
            return value.should.equal(true);
        });
    });

    // it("should set a select value", function () {
    //     dom.render(<select>
    //         <option value="value 1">text 1</option>
    //         <option value="value 2" selected>text 2</option>
    //         <option value="value 3">text 3</option>
    //     </select>);
    //
    //     browser.execute.withArgs(getTagNameFromClient).returns("select");
    //     browser.execute.withArgs(setSelectValueOnClient).returns("value 2");
    //
    //     return glance.set("select:value", "value 2").then(function (value) {
    //         return value.should.equal("value 2");
    //     });
    // });

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

        return glance.set("custom-input:value", "changed value").then(() => {
            return browser.setValue.should.have.been.calledWith(dom.get('target'), "changed value");
        });
    });
});