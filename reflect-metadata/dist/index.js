"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
var classDecorator = function () { return function (target) {
    var properties = Reflect.getOwnMetadata('design:type', target);
    var parameters = Reflect.getOwnMetadata('design:paramtypes', target);
    var returntype = Reflect.getOwnMetadata('design:returntype', target);
    console.log('\nclass metadata');
    console.log(properties);
    console.log(parameters);
    console.log(returntype);
    return /** @class */ (function (_super) {
        __extends(class_1, _super);
        function class_1() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.job = 'it';
            return _this;
        }
        return class_1;
    }(target));
}; };
var funcDecorator = function () { return function (target, propertyKey, descriptor) {
    var properties = Reflect.getOwnMetadata('design:type', target, propertyKey);
    var parameters = Reflect.getOwnMetadata('design:paramtypes', target, propertyKey);
    var returntype = Reflect.getOwnMetadata('design:returntype', target, propertyKey);
    console.log('\nfunc metadata');
    console.log(properties);
    console.log(parameters);
    console.log(returntype);
}; };
var propertyDecorator = function () { return function (target, propertyKey) {
    var properties = Reflect.getOwnMetadata('design:type', target, propertyKey);
    var parameters = Reflect.getOwnMetadata('design:paramtypes', target, propertyKey);
    var returntype = Reflect.getOwnMetadata('design:returntype', target, propertyKey);
    console.log('\nproperty metadata');
    console.log(properties);
    console.log(parameters);
    console.log(returntype);
}; };
var parameterDecorator = function () { return function (target, propertyKey, paramIndex) {
    var properties = Reflect.getOwnMetadata('design:type', target, propertyKey);
    var parameters = Reflect.getOwnMetadata('design:paramtypes', target, propertyKey);
    var returntype = Reflect.getOwnMetadata('design:returntype', target, propertyKey);
    console.log('\nparameter metadata');
    console.log(properties);
    console.log(parameters[paramIndex]);
    console.log(returntype);
}; };
var Props = /** @class */ (function () {
    function Props() {
    }
    return Props;
}());
var People = /** @class */ (function () {
    function People(name) {
        this.name = name;
    }
    People.prototype.getName = function (props) {
        return props.name + this.name;
    };
    __decorate([
        funcDecorator(),
        __param(0, parameterDecorator()),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Props]),
        __metadata("design:returntype", String)
    ], People.prototype, "getName", null);
    __decorate([
        propertyDecorator(),
        __metadata("design:type", String)
    ], People.prototype, "name", void 0);
    People = __decorate([
        classDecorator(),
        __metadata("design:paramtypes", [String])
    ], People);
    return People;
}());
//# sourceMappingURL=index.js.map