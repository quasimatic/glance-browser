import dom from "./dom"
import createGlance from './mock-glance';

describe("Misc", function () {
    let glance;

    beforeEach(function () {
        document.body.innerHTML = "";

        let mock = createGlance();
        glance = mock.glance;
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