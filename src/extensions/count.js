import '../utils/promise-utils'

export default  {
    transforms: {
        "count": {
            get: function ({selector, glance}) {
                return glance.find(selector).then((elements) => [].concat(elements).length, (error) => 0);
            }
        }
    }
}