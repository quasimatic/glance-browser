import browser from "./extensions/browser";
import value from "./extensions/value";

export default {
    properties: {...browser.properties, ...value.properties}
}