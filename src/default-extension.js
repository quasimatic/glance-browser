import browser from "./extensions/browser";
import value from "./extensions/value";
import text from "./extensions/text";
import html from "./extensions/html";

export default {
    properties: {...browser.properties, ...value.properties, ...text.properties, ...html.properties}
}