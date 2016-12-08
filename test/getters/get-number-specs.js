import dom from "../dom";
import createGlance from '../mock-glance';

import {
    getHtmlFromClient
} from '../../src/utils/client';

describe("Get: date", function () {
    this.timeout(10000)
    let glance;
    let browser;

    beforeEach(function () {
        document.body.innerHTML = "";

        let mock = createGlance();
        glance = mock.glance;
        browser = mock.browser;
    });

    it("should get date", async () => {
        dom.render(<div>
            <div className="start" id="target">10</div>
        </div>);

        browser.element.returns(dom.get('target'));
        browser.execute.returns("10");

        return (await glance.get("start:number")).should.equal(10);
    });
});