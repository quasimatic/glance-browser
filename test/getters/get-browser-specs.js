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

describe("Get: browser", function () {
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

    it("should get the title", function(){
        browser.getTitle.returns("Title");

        return glance.get("browser:title").should.eventually.equal("Title");
    })
});