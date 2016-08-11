import dom from "../dom"
import createGlance from '../mock-glance';

import {
    getTagNameFromClient,
    getTextFromClient,
    getSelectTextFromClient,
    getAttributeFromClient,
    setCheckboxValueFromClient,
    setSelectValueOnClient,
    triggerChange

} from '../../src/utils/client';

describe("Set: browser", function () {
    this.timeout(10000);

    let glance;
    let browser;

    beforeEach(function () {
        document.body.innerHTML = "";

        let mock = createGlance();
        glance = mock.glance;
        browser = mock.browser;
    });

    it("should set the url", function () {
        browser.setUrl.returns("http://differenturl");

        return glance.set("browser:url", "http://differenturl").then(() => {
            return browser.setUrl.should.have.been.calledWith("http://differenturl");
        })
    });
});