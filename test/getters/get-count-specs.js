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

    it("should get count", function(){
        dom.render(<div>
            <div>stuff 1</div>
            <div>stuff 2</div>
            <div>stuff 3</div>
        </div>);

        return glance.get("stuff:count").should.eventually.equal(3);
    });
});