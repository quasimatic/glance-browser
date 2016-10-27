import GlanceConverter from "./converters/glance-converter";
import {PromiseUtils,resolveSeries, firstResolved} from "./utils/promise-utils";
import Immutable from 'immutable'

var converters = [GlanceConverter];

function getTargetHooks(cast, target) {
    return cast.targetHooks.filter(function (hook) {
        return !hook.labelFilter || target.label == hook.labelFilter;
    });
}

function processTargets(cast, state, store, parentTarget) {
    parentTarget = parentTarget || {
            context: [],
            hooks: []
        };

    return resolveSeries(Object.keys(state), label => {
        let values = [].concat(state[label]);

        return resolveSeries(values, value => {
            var target = {
                label: label,
                value: value,
                context: parentTarget.context
            };

            var targetHooks;

            return firstResolved(converters, converter => {
                return resolveSeries(parentTarget.hooks, hook => hook.beforeEach({cast, target, store}))
                    .then(() => {
                        targetHooks = getTargetHooks(cast, target);
                        return resolveSeries(targetHooks, hook => hook.before({cast, target, store}));
                    })
                    .then(()=> {
                        if (target.continue) {
                            return target;
                        }
                        else {
                            return converter.process(cast, target, store);
                        }
                    })
                    .then(evaluatedTarget => {
                        return resolveSeries(targetHooks, hook => hook.after({cast, evaluatedTarget, store}))
                            .then(()=> {
                                if (!evaluatedTarget.handled) {
                                    evaluatedTarget.hooks = [];

                                    evaluatedTarget.hooks = evaluatedTarget.hooks.concat(parentTarget.hooks);

                                    evaluatedTarget.hooks = evaluatedTarget.hooks.concat(targetHooks);

                                    return processTargets(cast, value, store, evaluatedTarget).then(()=> {
                                        parentTarget.context.pop();
                                    });
                                }

                                return Promise.resolve(evaluatedTarget).then(evaluatedTarget => {
                                    store.currentState = store.currentState.updateIn(target.context.concat(target.label), value => evaluatedTarget.value);
                                    return resolveSeries(parentTarget.hooks, hook => hook.afterEach({cast, evaluatedTarget, store}));
                                });
                            });
                    });
            });
        });
    });
}

class Cast {
    constructor(options) {
        if (options.glance) {
            this.glance = options.glance;
        }

        this.beforeAll = options.beforeAll || [];
        this.afterAll = options.afterAll || [];

        this.targetHooks = (options.targetHooks || []).map(function (hook) {
            return Object.assign({
                labelFilter: null,
                before: function () {
                },
                after: function () {
                },
                beforeEach: function () {
                },
                afterEach: function () {
                },
                set: function () {
                },
                get: function () {
                },
                apply: function () {
                }
            }, hook);
        });

        this.targetEnter = options.targetEnter || [];
        this.targetLeave = options.targetLeave || [];

        this.literals = options.literals || [];

        this.logLevel = options.logLevel || "error";
        this.glance.setLogLevel('error');
    }

    apply(state) {
        var stores = [];
        var states = [].concat(state);

        return resolveSeries(states, (state) => {
            let store = {
                desiredState: Immutable.Map(state),
                currentState: Immutable.Map({})
            };

            return resolveSeries(this.beforeAll, beforeAll => beforeAll({cast:this, store}))
                .then(()=> processTargets(this, store.desiredState.toJS(), store))
                .then(()=> resolveSeries(this.afterAll, afterAll => afterAll({cast:this, store})))
                .then(()=> stores.push(store));
        })
            .then(() => {
                this.glance.setLogLevel(this.logLevel);
                if (stores.length == 1) {
                    return stores[0].currentState.toJS();
                }
                else {
                    return stores.map(s => s.currentState.toJS());
                }
            });
    }

    end() {
        return this.glance.browser.end();
    }
}

export default Cast;