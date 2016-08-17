import dom from "../dom"
import createGlance from '../mock-glance';

import {
    getTagNameFromClient,
    getTextFromClient,
    getSelectTextFromClient,
    getAttributeFromClient,
    setCheckboxValueFromClient,
    setSelectValueOnClient,
    triggerChange,
    setSelectByTextOnClient

} from '../../src/utils/client';

describe("Set: text", function () {
    this.timeout(10000);

    let glance;
    let browser;

    beforeEach(function () {
        document.body.innerHTML = "";

        let mock = createGlance();
        glance = mock.glance;
        browser = mock.browser;
    });

    it("should set a select by text", function () {
        dom.render(<select>
            <option value="value 1">text 1</option>
            <option value="value 2">text 2</option>
            <option value="value 3">text 3</option>
        </select>);

        browser.execute.withArgs(getTagNameFromClient).returns("select");
        browser.execute.withArgs(setSelectByTextOnClient).returns("text 2");

        return glance.set("select:text", "text 2").then(function (value) {
            return value.should.equal("text 2");
        });
    });
});