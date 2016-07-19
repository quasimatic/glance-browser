import PromiseWrappedAdapter from "../src/promise-wrapped-adapter";

export default function() {
    let driver = sinon.createStubInstance(PromiseWrappedAdapter);

    driver.log.returns([]);

    return driver;
}