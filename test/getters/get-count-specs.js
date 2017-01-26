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

describe("Get: count", function () {
    this.timeout(10000)
    let glance;
    let browser;

    beforeEach(function () {
        document.body.innerHTML = "";

        let mock = createGlance();
        glance = mock.glance;
        browser = mock.browser;
    });

    it("should get count", async () => {
        dom.render(<div>
            <div>stuff 1</div>
            <div>stuff 2</div>
            <div>stuff 3</div>
        </div>);

        return (await glance.get("stuff:count")).should.equal(3);
    });

    it("should get count for single item", async() => {
        dom.render(<span>item 1</span>);

        return (await glance.get("span:count")).should.equal(1);
    });

    it("should get 0 for no items", async() => {
        dom.render(<span>item 1</span>);

        return (await glance.get("input:count")).should.equal(0);
    });
});