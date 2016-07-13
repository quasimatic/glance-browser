import ReactDOM from 'react-dom';

window.customExecute = function (func, ...args) {
    let callback = typeof(args[args.length - 1]) == "function" ? args[args.length - 1] : function (value) {
        return value;
    };
    return callback(func.apply(func, args));
};

export default {
    get(...ids) {
        var result = ids.map(function(id) {
            return document.getElementById(id)
        });

        return result.length == 1? result[0] : result;
    },

    render(jsx) {
        var div = document.createElement("div");
        document.body.appendChild(div)
        return ReactDOM.render(jsx, div);
    }
}