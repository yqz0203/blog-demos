"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
function Type(type) {
    return Reflect.metadata('design:type', type);
}
// 验证类型
var validate = function (target, propertyKey, descriptor) {
    var set = descriptor.set;
    descriptor.set = function (value) {
        var type = Reflect.getMetadata('design:type', target, propertyKey);
        if (!(value instanceof type)) {
            throw new TypeError('Invalid type.');
        }
        set(value);
    };
};
var C = /** @class */ (function () {
    function C() {
    }
    Object.defineProperty(C.prototype, "name", {
        get: function () {
            return 'text';
        },
        enumerable: true,
        configurable: true
    });
    __decorate([
        validate,
        Type(String),
        __metadata("design:type", Object),
        __metadata("design:paramtypes", [])
    ], C.prototype, "name", null);
    return C;
}());
var c = new C();
// @ts-ignore
// 这里只是做演示，实际ts会报错的
c.name = 10; // throw TypeError('Invalid type.')
//# sourceMappingURL=validate.js.map