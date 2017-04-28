import TabManager from './tab-manager';
import sinon from 'sinon';

describe('Tab Manager', () => {
	let browser;

	beforeEach(() => {
		browser = {};
	});

	it('should reject if there is no active tab', () => {
		browser.getTabs = sinon.stub().returns(Promise.resolve([]));
		let tabManager = new TabManager(browser);

		return tabManager.ensureLatestTab().should.be.rejectedWith('No active browser windows');
	});

	it('should reject if it has no tab information', () => {
		browser.getTabs = sinon.stub().returns(Promise.resolve());
		let tabManager = new TabManager(browser);

		return tabManager.ensureLatestTab().should.be.rejectedWith('No active browser windows');
	});

	it('should reject if getting tabs throws an error', () => {
		browser.getTabs = sinon.stub().returns(Promise.resolve([123]));
		browser.getActiveTab = sinon.stub().returns(Promise.reject());

		let tabManager = new TabManager(browser);
		return tabManager.ensureLatestTab().should.be.rejectedWith('No active windows');
	});

	it('should set the active tab', () => {
		browser.getTabs = sinon.stub().returns(Promise.resolve([123]));
		browser.getActiveTab = sinon.stub().returns(Promise.resolve(123));
		let tabManager = new TabManager(browser);

		return tabManager.ensureLatestTab().should.eventually.equal(123);
	});

	it('should recall active tab', async () => {
		browser.getTabs = sinon.stub().returns(Promise.resolve([123]));
		browser.getActiveTab = sinon.stub().returns(Promise.resolve(123));
		let tabManager = new TabManager(browser);

		await tabManager.ensureLatestTab();
		return tabManager.ensureLatestTab().should.eventually.equal(123);
	});

	it('should switch to the new tab', async () => {
		browser.getTabs = sinon.stub().returns(Promise.resolve([123]));
		browser.getActiveTab = sinon.stub().returns(Promise.resolve(123));
		browser.setActiveTab = sinon.stub().returns(Promise.resolve(456));

		let tabManager = new TabManager(browser);

		await tabManager.ensureLatestTab();
		browser.getTabs = sinon.stub().returns(Promise.resolve([123, 456]));
		return tabManager.ensureLatestTab().should.eventually.equal(456);
	});

	it('should switch back to previous window', async () => {
		browser.getTabs = sinon.stub().returns(Promise.resolve([123]));
		browser.getActiveTab = sinon.stub().returns(Promise.resolve(123));
		browser.setActiveTab = sinon.stub().returns(Promise.resolve(123));

		let tabManager = new TabManager(browser);

		await tabManager.ensureLatestTab();
		browser.getTabs = sinon.stub().returns(Promise.resolve([123, 456]));
		browser.setActiveTab = sinon.stub().returns(Promise.resolve(456));
		await tabManager.ensureLatestTab();
		browser.getTabs = sinon.stub().returns(Promise.resolve([123]));
		browser.setActiveTab = sinon.stub().returns(Promise.resolve(123));
		return tabManager.ensureLatestTab().should.eventually.equal(123);
	});

	it('should switch back to the previous active window if there are more than 2', async () => {
		browser.getTabs = sinon.stub().returns(Promise.resolve([123, 456]));
		browser.getActiveTab = sinon.stub().returns(Promise.resolve(456));
		browser.setActiveTab = sinon.stub().returns(Promise.resolve(456));

		let tabManager = new TabManager(browser);

		await tabManager.ensureLatestTab();
		browser.getTabs = sinon.stub().returns(Promise.resolve([123, 456, 789]));
		browser.setActiveTab = sinon.stub().returns(Promise.resolve(789));
		await tabManager.ensureLatestTab();
		browser.getTabs = sinon.stub().returns(Promise.resolve([123, 456]));
		browser.setActiveTab = sinon.stub().returns(Promise.resolve(456));
		return tabManager.ensureLatestTab().should.eventually.equal(456);
	});

	it('should add active tab to window stack', async () => {
		browser.getTabs = sinon.stub().returns(Promise.resolve([123]));
		browser.getActiveTab = sinon.stub().returns(Promise.resolve(123));

		let tabManager = new TabManager(browser);

		await tabManager.ensureLatestTab();
		await tabManager.ensureLatestTab();
		browser.getTabs = sinon.stub().returns(Promise.resolve([456, 789]));
		browser.getActiveTab = sinon.stub().returns(Promise.resolve(456));

		return tabManager.ensureLatestTab().should.eventually.equal(123);
	});

	it('should walk the previous windows til it finds an existing one', async () => {
		browser.getTabs = sinon.stub().returns(Promise.resolve([123]));
		browser.getActiveTab = sinon.stub().returns(Promise.resolve(123));
		browser.setActiveTab = sinon.stub();

		let tabManager = new TabManager(browser);

		await tabManager.ensureLatestTab();
		await tabManager.ensureLatestTab();

		browser.getTabs = sinon.stub().returns(Promise.resolve([123, 456]));
		browser.getActiveTab = sinon.stub().returns(Promise.resolve(456));
		await tabManager.ensureLatestTab();

		browser.getTabs = sinon.stub().returns(Promise.resolve([123, 456, 789]));
		browser.getActiveTab = sinon.stub().returns(Promise.resolve(789));
		await tabManager.ensureLatestTab();

		browser.getTabs = sinon.stub().returns(Promise.resolve([123, 456, 789, 999]));
		browser.getActiveTab = sinon.stub().returns(Promise.resolve(999));
		await tabManager.ensureLatestTab();

		browser.getTabs = sinon.stub().returns(Promise.resolve([123,456]));
		browser.getActiveTab = sinon.stub().returns(Promise.resolve(456));
		browser.setActiveTab = sinon.stub().returns(Promise.resolve(456));
		return tabManager.ensureLatestTab().should.eventually.equal(456);
	});
});

