import dom from "./dom"
import createGlance from './mock-glance';

describe("Misc", function () {
    let glance;

    beforeEach(function () {
        document.body.innerHTML = "";

        let mock = createGlance();
        glance = mock.glance;
    });

    it("should find an element", async () => {
        dom.render(<button id="target">Content Item</button>);

        return (await glance.find("button")).should.deep.equal(dom.get('target'))
    });

    it("should find multiple elements", async () =>{
        dom.render(
            <div>
                <button id="target-1">Content Item</button>
                <button id="target-2">Content Item</button>
            </div>
        );

        return (await glance.find("button")).should.deep.equal(dom.get("target-1", "target-2"));
    });
});