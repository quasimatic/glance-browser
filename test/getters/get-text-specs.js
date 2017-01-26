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

describe("Get: text", function () {
    this.timeout(10000)
    let glance;
    let browser;

    beforeEach(function () {
        document.body.innerHTML = "";

        let mock = createGlance();
        glance = mock.glance;
        browser = mock.browser;
    });

    it("should get the text for the selected option", async () => {
        dom.render(<select>
            <option value="value 1">text 1</option>
            <option value="value 2" selected>text 2</option>
            <option value="value 3">text 3</option>
        </select>);

        browser.execute.withArgs(getTagNameFromClient).returns("select");
        browser.execute.withArgs(getSelectTextFromClient).returns("text 2");

        return (await glance.get("select:text")).should.equal("text 2");
    });

    it("should get the text", async () => {
        dom.render(<span>text 1</span>);

        browser.execute.withArgs(getTagNameFromClient).returns("span");
        browser.execute.withArgs(getTextFromClient).returns("text 1");

        return (await glance.get("span:text")).should.equal("text 1");
    });

    it("should get text for a custom label", async () => {
        dom.render(<span id="target">text 1</span>);

        browser.execute.withArgs(getTagNameFromClient).returns("input");
        browser.getValue.returns("text 1");

        glance.addExtension({
           labels: {
               "custom-input": function({glance}, callback) {
                   return glance.find("target").then(result => callback(null, result));
               }
           }
        });

        return (await glance.get("custom-input:text")).should.equal("text 1");
    });
});