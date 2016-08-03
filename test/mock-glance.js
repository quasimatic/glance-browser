import Glance from '../src/glance-common';
import Browser from "./browser";
import TabManager from "./tab-manager";

export default function() {
    let browser = new Browser();
    let tabManager = new TabManager();

    let glance = new Glance({
        browser: browser,
        tabManager: tabManager
    });

    return {browser, tabManager, glance};
}