import log from 'loglevel';

export default class TabManager {
	constructor(browser) {
		this.browser = browser;
		this.tabs = new Set();
		this.windowStack = [];
	}

	ensureLatestTab() {
		return this.browser.getTabs().then(currentTabs => {
			if (!currentTabs || currentTabs.length === 0) {
				return Promise.reject('No active browser windows');
			}

			log.debug('Tab count:', currentTabs.length);
			let currentTabSet = new Set(currentTabs);
			if (this.activeTab && currentTabSet && !currentTabSet.has(this.activeTab)) {
				return this.setPreviousWindowActive(currentTabSet, currentTabs);
			}

			return this.browser.getActiveTab().then(activeTab => {
				log.debug('Active Tab:', this.activeTab);
				if (this.activeTab) {
					let newTabs = currentTabs.filter(tab => !this.tabs.has(tab));

					log.debug('New Tab Count:', newTabs.length);

					if (newTabs.length > 0) {
						log.debug('Switching to new window:', newTabs[0]);
						this.setState(newTabs[0], currentTabSet);
						return this.browser.setActiveTab(this.activeTab);
					}
				}
				else {
					this.setState(activeTab, currentTabSet);
				}

				return Promise.resolve(this.activeTab);
			}, () => {
				return Promise.reject('No active windows');
			});
		});
	}

	setPreviousWindowActive(currentTabSet, currentTabs) {
		if (currentTabs.length === 1) {
			this.windowStack = [];
			this.setState(currentTabs[0], currentTabSet);
			return this.browser.setActiveTab(this.activeTab);
		}

		this.windowStack.pop();

		while (this.windowStack.length !== 0 && !currentTabSet.has(this.windowStack[this.windowStack.length - 1])) {
			this.windowStack.pop();
		}

		if (this.windowStack.length !== 0) {
			let previousTab = this.windowStack[this.windowStack.length - 1];
			log.debug('Switching to previous window:', previousTab);
			this.setState(previousTab, currentTabSet);
			return this.browser.setActiveTab(this.activeTab);
		}

		this.setState(this.activeTab, currentTabSet);
		return Promise.resolve(this.activeTab);
	}

	setState(id, currentTabSet) {
		this.activeTab = id;
		this.windowStack.push(id);
		this.tabs = currentTabSet;
	}
}
