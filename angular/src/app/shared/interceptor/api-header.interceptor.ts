import {Injectable} from '@angular/core';
import {HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpResponse, HttpErrorResponse} from '@angular/common/http';
import {Observable} from 'rxjs';
import { map, catchError} from 'rxjs/operators';
import {throwError} from 'rxjs';
import {AuthService} from '../service/auth.service';
import {Router} from '@angular/router';
import {MatDialog} from '@angular/material';

@Injectable()
export class ApiHeaderInterceptor implements HttpInterceptor {
    constructor(
        private router: Router,
        private authService: AuthService,
        private dialog: MatDialog) {
    }
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const token = localStorage.getItem('token');

        if (token) {
            let clonedReq;
            if (req.headers.get('file_upload') !== 'true') {
                clonedReq = req.clone({
                    headers: req.headers
                        .set('Authorization', 'Bearer ' + token)
                        .set('Content-Type', 'application/json; charset=UTF-8')
                });
            } else {
                clonedReq = req.clone({
                    headers: req.headers
                        .set('Authorization', 'Bearer ' + token),
                    reportProgress: true
                });
            }
            return next.handle(clonedReq);
        } else {
            return next.handle(req).pipe(
                map((event: HttpEvent<any>) => {
                    if (event instanceof HttpResponse) {

                    }
                    return event;
                }),
                catchError((error: HttpErrorResponse) => {
                    if (error && error.status === 401) {
                        this.router.navigate(['/signin'], );
                        this.dialog.closeAll();
                    }
                    return throwError(error);
                }));
        }
    }
}
