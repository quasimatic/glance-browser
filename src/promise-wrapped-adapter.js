class PromiseWrappedAdapter {
    constructor(adapter) {
        this.adapter = adapter;
        this.driver = adapter.driver;
    }

    init() {
        if(this.adapter.init)
            return Promise.resolve(this.adapter.init());

        return Promise.resolve();
    }

    getUrl() {
        return Promise.resolve(this.adapter.getUrl());
    }

    setUrl(address) {
        return Promise.resolve(this.adapter.setUrl(address));
    }

    getTabs() {
        return Promise.resolve(this.adapter.getTabs());
    }

    getActiveTab() {
        return Promise.resolve(this.adapter.getActiveTab());
    }

    setActiveTab(id) {
        return Promise.resolve(this.adapter.setActiveTab(id));
    }

    closeTab(id) {
        return Promise.resolve(this.adapter.closeTab(id));
    }

    type(keys) {
        return Promise.resolve(this.adapter.type(keys));
    }

    sendKeys(...keys) {
        return Promise.resolve(this.adapter.sendKeys(...keys));
    }

    click(element) {
        return Promise.resolve(this.adapter.click(element));
    }

    doubleClick(element) {
        return Promise.resolve(this.adapter.doubleClick(element));
    }

    middleClick(element) {
        return Promise.resolve(this.adapter.middleClick(element));
    }

    moveMouseTo(element, xOffset, yOffset) {
        return Promise.resolve(this.adapter.moveMouseTo(element, xOffset, yOffset));
    }

    rightClick(element) {
        return Promise.resolve(this.adapter.rightClick(element));
    }

    mouseDown(button) {
        return Promise.resolve(this.adapter.mouseDown(button));
    }

    mouseUp(button) {
        return Promise.resolve(this.adapter.mouseUp(button));
    }

    execute(func, ...args) {
        return Promise.resolve(this.adapter.execute(func, ...args));
    }

    executeAsync(func, ...args) {
        return Promise.resolve(this.adapter.executeAsync(func, ...args));
    }

    dragAndDrop(elementReferenceSource, elementReferenceTarget, xOffset, yOffset) {
        return Promise.resolve(this.adapter.dragAndDrop(elementReferenceSource, elementReferenceTarget, xOffset, yOffset));
    }

    pause(delay) {
        return Promise.resolve(this.adapter.pause(delay));
    }

    saveScreenshot(filename) {
        return Promise.resolve(this.adapter.saveScreenshot(filename));
    }

    end() {
        return Promise.resolve(this.adapter.end());
    }

    element(reference) {
        return Promise.resolve(this.adapter.element(reference));
    }

    elements(reference) {
        return Promise.resolve(this.adapter.elements(reference));
    }

    getValue(element) {
        return Promise.resolve(this.adapter.getValue(element));
    }

    setValue(element, ...values) {
        return Promise.resolve(this.adapter.setValue(element, ...values));
    }

    getTitle() {
        return Promise.resolve(this.adapter.getTitle());
    }

    log(type) {
        return Promise.resolve(this.adapter.log(type));
    }

    getWindowSize() {
        return Promise.resolve(this.adapter.getWindowSize());
    }

    setWindowSize(size) {
        return Promise.resolve(this.adapter.setWindowSize(size));
    }

    maximize() {
        return Promise.resolve(this.adapter.maximize());
    }
}

export default PromiseWrappedAdapter;
