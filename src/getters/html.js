import {getHTMLFromClient} from '../utils/client';

export default function({selector, glance}) {
    return glance.element(selector).then((element)=> {
        return glance.browser.execute(getHTMLFromClient, element);
    });
}