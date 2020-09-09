"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.LoginComponent = void 0;
var core_1 = require("@angular/core");
var forms_1 = require("@angular/forms");
var user_model_1 = require("src/app/models/user.model");
var LoginComponent = /** @class */ (function () {
    function LoginComponent(formBuilder, authService, router, snackBar, errorHandleService, activeRoute) {
        this.formBuilder = formBuilder;
        this.authService = authService;
        this.router = router;
        this.snackBar = snackBar;
        this.errorHandleService = errorHandleService;
        this.activeRoute = activeRoute;
    }
    LoginComponent.prototype.ngOnInit = function () {
        this.loginForm = this.formBuilder.group({
            username: ['', [forms_1.Validators.required]],
            password: ['', forms_1.Validators.required]
        });
        this.returnUrl = this.activeRoute.snapshot.queryParams['returnUrl'] || '/main/home';
    };
    LoginComponent.prototype.login = function () {
        var _this = this;
        if (this.loginForm.invalid) {
            return;
        }
        var username = this.loginForm.get('username').value.trim();
        var password = this.loginForm.get('password').value.trim();
        if (username && password) {
            this.authService.login(username, password).subscribe(function (res) {
                _this.errorsFromServer = undefined;
                _this.handleResponse(res);
            }, function (error) {
                _this.errorsFromServer = undefined;
                if (error && error.error) {
                    _this.errorHandleService.handleError(error.error);
                    _this.errorsFromServer = { message: '<span>' + _this.errorHandleService.errorMessage + '</span>' };
                }
                else {
                    _this.snackBar.open('Server Error', 'CLOSE', {
                        duration: 3000,
                        horizontalPosition: 'center',
                        verticalPosition: 'top'
                    });
                }
            });
        }
        else {
            this.snackBar.open('Username or Password can not be empty. Please Check', 'CLOSE', {
                duration: 3000,
                horizontalPosition: 'center',
                verticalPosition: 'top'
            });
        }
    };
    LoginComponent.prototype.handleResponse = function (resData) {
        if (resData && resData.token) {
            this.authService.user = new user_model_1.User();
            var verifyToken = this.authService.setSession(resData);
            if (verifyToken) {
                this.router.navigate([this.returnUrl]);
            }
            else {
                this.snackBar.open('Something wrong, Please try again', 'CLOSE', {
                    duration: 3000,
                    horizontalPosition: 'center',
                    verticalPosition: 'top'
                });
            }
        }
    };
    LoginComponent.prototype.closeErrorNotice = function () {
        this.errorsFromServer = undefined;
    };
    LoginComponent = __decorate([
        core_1.Component({
            selector: 'app-login',
            templateUrl: './login.component.html',
            styleUrls: ['./login.component.scss']
        })
    ], LoginComponent);
    return LoginComponent;
}());
exports.LoginComponent = LoginComponent;
