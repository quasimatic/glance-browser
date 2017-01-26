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

    it("should get the url", async () => {
        browser.getUrl.returns("http://localhost");

        return (await glance.get("browser:url")).should.equal("http://localhost");
    });

    it("should get the title", async () => {
        browser.getTitle.returns("Title");

        return (await glance.get("browser:title")).should.equal("Title");
    })
});