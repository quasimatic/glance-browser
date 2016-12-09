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

describe("Get: html", function () {
    this.timeout(10000)
    let glance;
    let browser;

    beforeEach(function () {
        document.body.innerHTML = "";

        let mock = createGlance();
        glance = mock.glance;
        browser = mock.browser;
    });

    it("should get html", async () => {
        dom.render(<span id='target'>text 1</span>);

        browser.element.returns(dom.get('target'));
        browser.execute.returns("<span>text 1</span>");

        return (await glance.get("span:html")).should.equal("<span>text 1</span>");
    });
});