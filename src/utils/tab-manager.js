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
            if(!currentTabs || currentTabs.length == 0) {
                return Promise.reject("No active browser windows");
            }

            log.debug("Tab count:", currentTabs.length);
            let currentTabSet = new Set(currentTabs);
            if(this.activeTab && currentTabSet && !currentTabSet.has(this.activeTab)) {
                return this.setPreviousWindowActive(currentTabSet, currentTabs);
            }

            return glance.browser.getActiveTab().then(activeTab => {
                log.debug("Active Tab:", this.activeTab);
                if(this.activeTab) {
                    var newTabs = currentTabs.filter((tab) => {
                        return !this.tabs.has(tab);
                    });

                    log.debug('New Tab Count:', newTabs.length);
                    if (newTabs.length > 0) {
                        log.debug("Switching to new window:", newTabs[0]);
                        this.setState(newTabs[0], currentTabSet);
                        return glance.browser.setActiveTab(this.activeTab);
                    }
                }
                else {
                    this.setState(activeTab, currentTabSet);
                }

                return Promise.resolve(this.activeTab);
            }, err => {
                return Promise.reject("No active windows");
            });
        });
    }

    setPreviousWindowActive(currentTabSet,currentTabs) {
        let glance = this.glance;

        if(currentTabs.length == 1) {
            this.windowStack = [];
            this.setState(currentTabs[0], currentTabSet);
            return glance.browser.setActiveTab(this.activeTab);
        }

        this.windowStack.pop();

        while(this.windowStack.length != 0 && !currentTabSet.has(this.windowStack[this.windowStack.length-1])) {
            this.windowStack.pop();
        }

        if(this.windowStack.length != 0) {
            let previousTab = this.windowStack[this.windowStack.length - 1];
            log.debug("Switching to previous window:", previousTab);
            this.setState(previousTab, currentTabSet);
            return glance.browser.setActiveTab(this.activeTab);
        }
        else {
            if(this.activeTab) {
                this.setState(activeTab, currentTabSet);
                return Promise.resolve(this.activeTab);
            }

            return Promise.reject("No active windows");
        }
    }

    setState(id, currentTabSet) {
        this.activeTab = id;
        this.windowStack.push(id)
        this.tabs = currentTabSet;
    }
}
