import dom from "../dom";
import createGlance from '../mock-glance';

import {
    getTagNameFromClient,
    getTextFromClient,
    getHtmlFromClient,
    getSelectTextFromClient,
    getAttributeFromClient,
    checkboxValueFromClient,
    getSelectValueFromClient
} from '../../src/utils/client';

describe("Get: value", function () {
    this.timeout(10000)
    let glance;
    let browser;

    beforeEach(function () {
        document.body.innerHTML = "";

        let mock = createGlance();
        glance = mock.glance;
        browser = mock.browser;
    });

    it("should get an input value", async () => {
        dom.render(<input id="target" value="value 1"/>);

        browser.execute.withArgs(getTagNameFromClient).returns("input");
        browser.getValue.returns("value 1");

        return (await glance.get("input:value")).should.equal("value 1");
    });

    it("should get a checkbox value", async () => {
        dom.render(<input id="target" type="checkbox" checked/>);

        browser.execute.withArgs(getTagNameFromClient).returns("input");
        browser.execute.withArgs(getAttributeFromClient).returns("checkbox");
        browser.execute.withArgs(checkboxValueFromClient).returns(true);

        return (await glance.get("input:value")).should.equal(true);
    });

    it("should get the text", async () => {
        dom.render(<span>text 1</span>);

        browser.execute.withArgs(getTagNameFromClient).returns("span");
        browser.execute.withArgs(getTextFromClient).returns("text 1");

        return (await glance.get("span:text")).should.equal("text 1");
    });

    it("should get the value for a select ", async () => {
        dom.render(<select>
            <option value="value 1">text 1</option>
            <option value="value 2" selected>text 2</option>
            <option value="value 3">text 3</option>
        </select>);

        browser.execute.withArgs(getTagNameFromClient).returns("select");
        browser.execute.withArgs(getSelectValueFromClient).returns("value 2");

        return (await glance.get("select:value")).should.equal("value 2");
    });

    it("should get input value for a custom label", async () => {
        dom.render(<div>
            <input value="value 1"/>
            <input id="target" value="value 2"/>
            <input value="value 3"/>
        </div>);

        browser.execute.withArgs(getTagNameFromClient).returns("input");
        browser.getValue.returns("value 2");

        glance.addExtension({
           labels: {
               "custom-input": function({glance}, callback) {
                   return glance.find("target").then(result => callback(null, result));
               }
           }
        });

        return (await glance.get("custom-input:value")).should.equal("value 2");
    });
});