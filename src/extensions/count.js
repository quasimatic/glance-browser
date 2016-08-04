import '../utils/promise-utils'

export default  {
    properties: {
        "count": {
            get: function (data) {
                var {selector, glance} = data;
                return glance.find(selector).then(elements => elements.length);
            }
        }
    }
}