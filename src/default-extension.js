import getHTML from './getters/html'
import getValue from './getters/value';

export default {
    labels: {
        // 'input': {
        //     get: function(){
        //
        //     },
        //
        //     set: function(){
        //
        //     }
        // }
    },
    properties: {
        'html': {
            get: getHTML
        },

        'value': {
            get: getValue
        }
    }
};