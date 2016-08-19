import browser from "./extensions/browser";
import value from "./extensions/value";
import text from "./extensions/text";
import html from "./extensions/html";
import count from "./extensions/count";
import date from "./extensions/date";
import number from "./extensions/number";

export default {
    properties: {...browser.properties, ...value.properties, ...text.properties, ...html.properties, ...count.properties, ...date.properties, ...number.properties}
}