import log from 'loglevel';

export default class TabManager {
    constructor(glance) {
        this.glance = glance;
        this.tabs = new Set();
        this.windowStack = [];
    }

    ensureLatestTab() {
        let glance = this.glance;

        return glance.browser.getTabs().then(currentTabs => {
            let currentTabSet = new Set(currentTabs);
            return glance.browser.getActiveTab().then(activeTab => {
                if(this.activeTab) {
                    var newTabs = currentTabs.filter((tab) => {
                        return !this.tabs.has(tab);
                    });

                    if (newTabs.length > 0) {
                        log.debug("Switching to new window:", newTabs[0]);
                        this.setState(newTabs[0], currentTabSet);
                        return glance.browser.setActiveTab(this.activeTab)
                    }
                }
                else {
                    this.setState(activeTab, currentTabSet);
                }

                return this.activeTab;
            }, () => {
                this.windowStack.pop();

                while(this.windowStack.length != 0 && !currentTabSet.has(this.windowStack[this.windowStack.length-1])) {
                    this.windowStack.pop();
                }

                if(this.windowStack.length != 0) {
                    let previousTab = this.windowStack[this.windowStack.length - 1];
                    this.setState(previousTab, currentTabSet);
                    return glance.browser.setActiveTab(previousTab)
                }
                else {
                    return Promise.reject("No active windows");
                }
            });
        });
    }

    setState(id, currentTabSet) {
        this.activeTab = id;
        this.windowStack.push(id)
        this.tabs = currentTabSet;
    }
}
