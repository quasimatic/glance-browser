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

    it("should find an element", function () {
        dom.render(<button id="target">Content Item</button>);

        return glance.find("button").should.eventually.deep.equal(dom.get('target'))
    });

    it("should find multiple elements", function () {
        dom.render(
            <div>
                <button id="target-1">Content Item</button>
                <button id="target-2">Content Item</button>
            </div>
        );

        return glance.find("button").should.eventually.deep.equal(dom.get("target-1", "target-2"));
    });
});