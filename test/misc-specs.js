import Glance from '../src/glance-common';
import dom from "./dom"
import Browser from "./browser";

describe("Misc", function () {
    let glance;
    let browser;

    beforeEach(function () {
        document.body.innerHTML = "";

        browser = new Browser();

        glance = new Glance({
            browser: browser
        });
    });

    it("should click an element", function (done) {
        dom.render(<button id="target">Content Item</button>);

        browser.element.returns(document.body);

        glance.click("button").then(function(){
            browser.click.should.have.been.calledWith(dom.get('target'));
            done();
        });
    });
});