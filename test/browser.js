import PromiseWrappedDriver from "../src/promise-wrapped-driver";

export default function() {
    let driver = sinon.createStubInstance(PromiseWrappedDriver);

    driver.log.returns([]);

    return driver;
}