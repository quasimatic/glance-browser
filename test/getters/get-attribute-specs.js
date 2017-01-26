import dom from "../dom";
import createGlance from '../mock-glance';

import {
    getTagNameFromClient,
    getHtmlFromClient,
    getAttributeFromClient,
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
        dom.render(<a id="target" href="http://test.com" />);

        browser.execute.withArgs(getTagNameFromClient).returns("a");
        browser.execute.withArgs(getAttributeFromClient).returns("http://test.com");

        return (await glance.get("target:attribute-href")).should.equal("http://test.com");
    });
});