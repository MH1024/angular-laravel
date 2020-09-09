import {Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot} from '@angular/router';
import {Injectable} from '@angular/core';
import {AuthService} from '../service/auth.service';

@Injectable()
export class AuthGuard implements CanActivate {

    constructor(private router: Router, private authService: AuthService) {
    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
        return new Promise((resolve) => {
            this.authService.isAuthenticated().then(
                (res) => {
                    if (res) {
                        resolve(true);
                    } else {
                        this.router.navigate(['/'], {queryParams: {returnUrl: state.url}});
                        resolve(false);
                    }
                }
            );
        });
    }
}