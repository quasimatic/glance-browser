import dom from "../dom";
import createGlance from '../mock-glance';
import chaiDateTime from 'chai-datetime';
chai.use(chaiDateTime);

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

    it("should get date", function(){
        dom.render(<div>
            <div className="start" id="target">1/1/2000</div>
        </div>);

        browser.element.returns(dom.get('target'));
        browser.execute.returns("1/1/2000");

        return glance.get("start:date").then(date => date.should.equalDate(new Date("1/1/2000")));
    });
});