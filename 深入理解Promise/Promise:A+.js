function noop() { };

const nextId = (function () {
    let id = 1;
    return function () {
        return id++;
    }
})();

// as soon as possible
const asap = (typeof process !== 'undefined' && process.nextTick)
    || setImmediate || setTimeout;

class MyPromise {
    constructor(executor) {
        this.id = nextId();
        this._child = null;
        this._deferred = [];
        this._status = 0; // 0:pending 1:fulfilled 2:rejected
        this._value = undefined;

        try {
            // executor执行是同步的
            executor(this._onfulfilled.bind(this), this._onRejected.bind(this));
        } catch (error) {
            this._onReject(error);
        }
    }

    _onfulfilled(value) {
        // 防止多次触发
        if (this._status !== 0) return;

        // 返回的是promise，要等待完成
        if (value && value.then) {
            value.then((val) => {
                this._onfulfilled(val);
            }, (reason) => this._onRejected(reason));
            return;
        }

        this._dofulfilled(value);
    }

    _dofulfilled(value) {
        this._status = 1;
        this._value = value;
        asap(() => {
            this._handle();
        });
    }

    _onRejected(reason) {
        // 防止多次触发
        if (this._status !== 0) return;

        this._doRejected(reason);
    }

    _doRejected(reason) {
        this._status = 2;
        this._value = reason;
        asap(() => {
            this._handle();
        });
    }

    _handle() {
        const value = this._value;

        if (this._deferred.length === 0 && this._status === 2) {
            console.warn('未处理的promise异常', value);
            return;
        }

        for (let i = 0, l = this._deferred.length; i < l; i++) {
            const cb = this._status === 1 ? this._deferred[i].fulfill : this._deferred[i].reject;
            // 没有回调，直接将当前值抛给下一个promise
            if (!cb) {
                if (this._status === 1) {
                    this._resolve(value);
                } else {
                    this._reject(value);
                }
            } else {
                try {
                    const res = cb(value);

                    if (res === this._child) {
                        throw new TypeError('无法将下一个promise作为值返回，会引起循环调用');
                    }

                    // 假设这样可以断定这是一个promise
                    if (res && res.then && typeof res.then === 'function') {
                        try {
                            res.then(this._onfulfilled.bind(this._child), this._onRejected.bind(this._child));
                        } catch (error) {
                            this._reject(error);
                        }
                    } else {
                        // 直接resolve给下一个promise
                        this._resolve(res);
                    }

                } catch (error) {
                    // 尝试把错误抛给下一个promise
                    this._reject(error);
                }
            }
        }
        this._deferred = [];
    }

    _resolve(value) {
        if (this._child) {
            this._child._onfulfilled(value);
        }
    }

    _reject(reason) {
        if (this._child) {
            this._child._onRejected(reason);
        }
    }

    then(onFulfilled, onRejection) {
        const child = new this.constructor(noop);
        this._child = child;

        this._deferred.push({
            fulfill: onFulfilled || null,
            reject: onRejection || null,
        });

        if (this._status !== 0) {
            this._handle();
        }

        return child;
    }

    catch(onRejection) {
        return this.then(null, onRejection);
    }

    finally(onFinally) {
        return this.then(() => onFinally(), () => onFinally());
    }
}

MyPromise.resolve = function (value) {
    return new MyPromise(resolve => resolve(value));
}

MyPromise.reject = function (reason) {
    return new MyPromise((resolve, reject) => reject(reason));
}

MyPromise.all = function () {
    const promiseArr = arguments[0];
    if (!Array.isArray(promiseArr)) {
        throw new Error('需要传入数组');
    }

    const result = new Array(promiseArr.length);

    return new MyPromise((resolve, reject) => {
        let done = false;
        let count = 0;

        function setResult(index, value) {
            if (done) return;
            count++;
            result[index] = value;
            if (count === promiseArr.length) {
                resolve(result);
                done = true;
            }
        }

        function setError(reason) {
            if (done) return;

            done = true;
            reject(reason);
        }

        promiseArr.forEach((promise, index) => {
            // 即使不是promise也包装成promise
            MyPromise.resolve(promise)
                .then((value) => {
                    setResult(index, value);
                })
                .catch((reason) => {
                    setError(reason)
                });
        });
    });
}

MyPromise.race = function () {
    const promiseArr = arguments[0];
    if (!Array.isArray(promiseArr)) {
        throw new Error('需要传入数组');
    }

    return new MyPromise((resolve, reject) => {
        let done = false;

        function setResult(value) {
            if (done) return;

            done = true;
            resolve(value);
        }

        function setError(reason) {
            if (done) return;

            done = true;
            reject(reason);
        }

        promiseArr.forEach((promise) => {
            MyPromise.resolve(promise)
                .then((value) => {
                    setResult(value);
                })
                .catch((reason) => {
                    setError(reason)
                });
        });
    });
}

module.exports = MyPromise;
