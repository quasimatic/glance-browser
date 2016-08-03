import dom from "./dom";
import createGlance from './mock-glance';

describe("Misc", function () {
    let glance;
    let browser;

    beforeEach(function () {
        document.body.innerHTML = "";

        let mock = createGlance();
        glance = mock.glance;
        browser = mock.browser;
    });

    it("should click an element", function (done) {
        dom.render(<button id="target">Content Item</button>);

        browser.element.returns(document.body);

        glance.click("button").then(function () {
            browser.click.should.have.been.calledWith(dom.get('target'));
            done();
        });
    });
});