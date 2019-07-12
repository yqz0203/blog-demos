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
var key = Symbol('key');
var C = /** @class */ (function () {
    function C() {
    }
    C.prototype.method = function () {
        //
    };
    __decorate([
        Reflect.metadata(key, 'hehe'),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", void 0)
    ], C.prototype, "method", null);
    return C;
}());
Reflect.defineMetadata(key, 'haha', C);
console.log(Reflect.getMetadata(key, C)); // haha
var c = new C();
console.log(Reflect.getMetadata(key, C, 'method')); // undefined
console.log(Reflect.getOwnMetadata(key, c, 'method')); // undefined，因为是存在原型上的。
console.log(Reflect.getMetadata(key, c, 'method')); // hehe
// 修改method的
Reflect.defineMetadata(key, 'eeee', C.prototype, 'method');
console.log(Reflect.getMetadata(key, c, 'method')); // eeee
// 如果修改
Reflect.defineMetadata(key, 'fff', c, 'method');
console.log(Reflect.getOwnMetadata(key, c, 'method')); // fff
console.log(Reflect.getMetadata(key, c, 'method')); // eeee
//# sourceMappingURL=location.js.map