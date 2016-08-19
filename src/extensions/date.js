import '../utils/promise-utils'

export default  {
    properties: {
        "date": {
            get: function (data) {
                var {selector, glance} = data;
                return glance.find(selector).then(element => {
                    return glance.browser.execute(function(e){
                        return e.innerText;
                    }, element).then(d => new Date(d));
                });
            }
        }
    }
}