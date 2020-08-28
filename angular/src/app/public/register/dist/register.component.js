"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.RegisterComponent = void 0;
var core_1 = require("@angular/core");
var forms_1 = require("@angular/forms");
var RegisterComponent = /** @class */ (function () {
    function RegisterComponent(formBuilder, snackBar, router, authService, errorHandleService) {
        this.formBuilder = formBuilder;
        this.snackBar = snackBar;
        this.router = router;
        this.authService = authService;
        this.errorHandleService = errorHandleService;
        this.passRegex = '^(?=.*[0-9])(?=.*[a-zA-Z])[a-zA-Z0-9]{8,}$';
        this.goToLoginPanel = new core_1.EventEmitter();
    }
    RegisterComponent.prototype.ngOnInit = function () {
        this.registerForm = this.formBuilder.group({
            name: ['', forms_1.Validators.required],
            email: ['', [forms_1.Validators.required, forms_1.Validators.email]],
            password: ['', [forms_1.Validators.required, forms_1.Validators.pattern(this.passRegex)]],
            passwordConfirm: ['', [forms_1.Validators.required, confirmPassword]]
        });
    };
    RegisterComponent.prototype.register = function () {
        var _this = this;
        var registerFormValue = this.registerForm.getRawValue();
        var flatErrors = function (errorsObj) {
            var fieldArray = ['name', 'password', 'email'];
            var innerDiv = '<ul>';
            for (var _i = 0, fieldArray_1 = fieldArray; _i < fieldArray_1.length; _i++) {
                var fieldName = fieldArray_1[_i];
                if (errorsObj[fieldName] && Array.isArray(errorsObj[fieldName])) {
                    innerDiv += errorsObj[fieldName].reduce(function (accumulator, currentValue) {
                        var itemDiv = '<li>' + currentValue + '</li>';
                        return accumulator + itemDiv;
                    }, '');
                    console.log(innerDiv);
                }
            }
            innerDiv += '</ul>';
            return innerDiv;
        };
        this.authService.register(registerFormValue).subscribe(function (resp) {
            _this.router.navigate(['/public/login']);
            _this.registerForm.reset();
            _this.goToLoginPanel.emit('');
            _this.snackBar.open(resp, 'Dismiss', {
                duration: 5000,
                horizontalPosition: 'right',
                verticalPosition: 'top'
            });
        }, function (error) {
            if (error) {
                _this.errorsFromServer = undefined;
                if (error && error.error) {
                    var errorObj = error.error.errors ? { message: flatErrors(error.error.errors) } : error.error;
                    _this.errorHandleService.handleError(errorObj);
                    console.log(_this.errorHandleService.errorMessage);
                    _this.errorsFromServer = { message: '<div>' + _this.errorHandleService.errorMessage + '</div>' };
                }
                else {
                    _this.snackBar.open('Server Error', 'CLOSE', {
                        duration: 3000,
                        horizontalPosition: 'right',
                        verticalPosition: 'top'
                    });
                }
            }
            else {
                _this.snackBar.open('Server Error', 'CLOSE', {
                    duration: 3000,
                    horizontalPosition: 'right',
                    verticalPosition: 'top'
                });
            }
        });
    };
    RegisterComponent.prototype.closeErrorNotice = function () {
        this.errorsFromServer = undefined;
    };
    __decorate([
        core_1.Output()
    ], RegisterComponent.prototype, "goToLoginPanel");
    RegisterComponent = __decorate([
        core_1.Component({
            selector: 'app-register',
            templateUrl: './register.component.html',
            styleUrls: ['./register.component.scss']
        })
    ], RegisterComponent);
    return RegisterComponent;
}());
exports.RegisterComponent = RegisterComponent;
function confirmPassword(control) {
    if (!control.parent || !control) {
        return;
    }
    var password = control.parent.get('password');
    var passwordConfirm = control.parent.get('passwordConfirm');
    if (!password || !passwordConfirm) {
        return;
    }
    if (passwordConfirm.value === '') {
        return;
    }
    if (password.value !== passwordConfirm.value) {
        return {
            passwordsNotMatch: true
        };
    }
}
