import TabManager from "../src/utils/tab-manager";

export default function() {
    let tabManaager =  sinon.createStubInstance(TabManager);
    tabManaager.ensureLatestTab.returns(Promise.resolve());
    return tabManaager;
}