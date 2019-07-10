var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var logger = function (type) { return function (target, propertyKey, descriptor) {
    var value = descriptor.value;
    descriptor.value = function () {
        console.log(type + " -> start " + propertyKey + "  with:", Array.prototype.slice.apply(arguments));
        var result = value.apply(target, arguments);
        console.log(type + " -> end " + propertyKey + " return:", result);
    };
}; };
var User = /** @class */ (function () {
    function User() {
    }
    User.prototype.eat = function (food) {
        // ...
        return food === 'fish' ? 'bad' : 'good';
    };
    User.prototype.sleep = function () {
        // ...
    };
    __decorate([
        logger('User'),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [String]),
        __metadata("design:returntype", void 0)
    ], User.prototype, "eat", null);
    __decorate([
        logger('User'),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", void 0)
    ], User.prototype, "sleep", null);
    return User;
}());
var user = new User();
user.eat('fish');
user.eat('meat');
user.sleep();
var f = function () {
    console.log('f()');
    return function (target) {
        console.log('fd()');
    };
};
var g = function () {
    console.log('g()');
    return function (target) {
        console.log('gd()');
    };
};
var Foo = /** @class */ (function () {
    function Foo() {
    }
    Foo = __decorate([
        f(),
        g()
    ], Foo);
    return Foo;
}());
//# sourceMappingURL=logger.js.map