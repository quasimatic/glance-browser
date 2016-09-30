import browser from "./extensions/browser";
import value from "./extensions/value";
import text from "./extensions/text";
import html from "./extensions/html";
import count from "./extensions/count";
import date from "./extensions/date";
import number from "./extensions/number";

export default {
    transforms: {...browser.transforms, ...value.transforms, ...text.transforms, ...html.transforms, ...count.transforms, ...date.transforms, ...number.transforms}
}