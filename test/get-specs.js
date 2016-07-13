import Glance from '../src/glance-common';
import dom from "./dom"
import Browser from "./browser";

import {
    getTagNameFromClient,
    getTextFromClient,
    getUrlFromClient,
    getSelectTextFromClient,
    getAttributeFromClient,
    checkboxValueFromClient
} from '../src/utils/client';

describe("Get", function () {
    let glance;
    let browser;

    beforeEach(function () {
        document.body.innerHTML = "";
        browser = new Browser();

        glance = new Glance({
            browser: browser
        });
    });

    it("should get the url", function (done) {
        browser.execute.withArgs(getUrlFromClient).returns("http://localhost");

        glance.get("$browser:url").then(function (value) {
            value.should.equal("http://localhost");
            done();
        });
    });

    it("should get a text input value", function (done) {
        dom.render(<input id="target" value="value 1"/>);

        browser.execute.withArgs(getTagNameFromClient).returns("input");
        browser.getValue.returns("value 1");

        glance.get("input").then(function (value) {
            value.should.equal("value 1");
            done();
        });
    });

    it("should get a checkbox value", function (done) {
        dom.render(<input id="target" type="checkbox" checked/>);

        browser.execute.withArgs(getTagNameFromClient).returns("input");
        browser.execute.withArgs(getAttributeFromClient).returns("checkbox");
        browser.execute.withArgs(checkboxValueFromClient).returns(true);

        glance.get("input").then(function (value) {
            value.should.equal(true);
            done();
        });
    });

    it("should get a select value", function (done) {
        dom.render(<select>
            <option value="value 1">text 1</option>
            <option value="value 2" selected>text 2</option>
            <option value="value 3">text 3</option>
        </select>);

        browser.execute.withArgs(getTagNameFromClient).returns("select");
        browser.execute.withArgs(getSelectTextFromClient).returns("text 2");

        glance.get("select").then(function (value) {
            value.should.equal("text 2");
            done();
        });
    });

    it("should get the text", function (done) {
        dom.render(<span>text 1</span>);

        browser.execute.withArgs(getTagNameFromClient).returns("span");
        browser.execute.withArgs(getTextFromClient).returns("text 1");

        glance.get("span").then(function (value) {
            value.should.equal("text 1");
            done();
        });
    });

    it("should get the value for a select ", function(done) {
        dom.render(<select>
            <option value="value 1">text 1</option>
            <option value="value 2" selected>text 2</option>
            <option value="value 3">text 3</option>
        </select>);

        browser.execute.withArgs(getTagNameFromClient).returns("select");
        browser.getValue.returns("value 2");

        glance.get("select:value").then(function (value) {
            value.should.equal("value 2");
            done();
        });
    });

    it("should get text input value for a custom field", function(done) {
        dom.render(<div>
            <input value="value 1"/>
            <input id="target" value="value 2"/>
            <input value="value 3"/>
        </div>);

        browser.execute.withArgs(getTagNameFromClient).returns("input");
        browser.getValue.returns("value 2");

        glance.addExtension({
           labels: {
               "custom-input": function(selector, scope, {glance}, callback) {
                   return glance.element("target").then(result => callback(null, result));
               }
           }
        });

        glance.get("custom-input").then(function (value) {
            value.should.equal("value 2");
            done();
        });
    });
});