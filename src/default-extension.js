import browser from "./extensions/browser";
import value from "./extensions/value";
import text from "./extensions/text";

export default {
    properties: {...browser.properties, ...value.properties, ...text.properties}
}