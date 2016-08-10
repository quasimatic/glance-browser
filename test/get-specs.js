import dom from "./dom";
import createGlance from './mock-glance';

import {
    getTagNameFromClient,
    getTextFromClient,
    getHtmlFromClient,
    getSelectTextFromClient,
    getAttributeFromClient,
    checkboxValueFromClient
} from '../src/utils/client';

describe("Get", function () {
    this.timeout(10000)
    let glance;
    let browser;

    beforeEach(function () {
        document.body.innerHTML = "";

        let mock = createGlance();
        glance = mock.glance;
        browser = mock.browser;
    });

    it("should get the url", function () {
        browser.getUrl.returns("http://localhost");

        return glance.get("browser:url").should.eventually.equal("http://localhost");
    });

    it("should get a text input value", function () {
        dom.render(<input id="target" value="value 1"/>);

        browser.execute.withArgs(getTagNameFromClient).returns("input");
        browser.getValue.returns("value 1");

        return glance.get("input:value").should.eventually.equal("value 1");
    });

    it("should get a text input value", function () {
        dom.render(<input id="target" value="value 1"/>);

        browser.execute.withArgs(getTagNameFromClient).returns("input");
        browser.getValue.returns("value 1");

        return glance.get("input:value").should.eventually.equal("value 1");
    });

    it("should get a checkbox value", function () {
        dom.render(<input id="target" type="checkbox" checked/>);

        browser.execute.withArgs(getTagNameFromClient).returns("input");
        browser.execute.withArgs(getAttributeFromClient).returns("checkbox");
        browser.execute.withArgs(checkboxValueFromClient).returns(true);

        return glance.get("input:value").should.eventually.equal(true);
    });

    it("should get a select value", function () {
        dom.render(<select>
            <option value="value 1">text 1</option>
            <option value="value 2" selected>text 2</option>
            <option value="value 3">text 3</option>
        </select>);

        browser.execute.withArgs(getTagNameFromClient).returns("select");
        browser.execute.withArgs(getSelectTextFromClient).returns("text 2");

        return glance.get("select").should.eventually.equal("text 2");
    });

    it("should get the text", function () {
        dom.render(<span>text 1</span>);

        browser.execute.withArgs(getTagNameFromClient).returns("span");
        browser.execute.withArgs(getTextFromClient).returns("text 1");

        return glance.get("span").should.eventually.equal("text 1");
    });

    it("should get the value for a select ", function() {
        dom.render(<select>
            <option value="value 1">text 1</option>
            <option value="value 2" selected>text 2</option>
            <option value="value 3">text 3</option>
        </select>);

        browser.execute.withArgs(getTagNameFromClient).returns("select");
        browser.execute.withArgs(getSelectTextFromClient).returns("value 2");

        return glance.get("select:value").should.eventually.equal("value 2");
    });

    it("should get text input value for a custom field", function() {
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
                   return glance.element("target").then(result => callback(null, result));
               }
           }
        });

        return glance.get("custom-input:value").should.eventually.equal("value 2");
    });

    it("should get html", function(){
        dom.render(<span id='target'>text 1</span>);

        browser.element.returns(dom.get('target'));
        browser.execute.returns("<span>text 1</span>");

        return glance.get("span:html").should.eventually.equal("<span>text 1</span>");
    });
});