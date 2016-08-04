import {getValueFromClient} from '../utils/client';

export default function({element, glance}) {
    return glance.browser.getValue(element);
}