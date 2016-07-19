import getHTML from './getters/html'
import getValue from './getters/value';

export default {
    properties: {
        'html': {
            get: getHTML
        },

        'value': {
            get: getValue
        }
    }
};