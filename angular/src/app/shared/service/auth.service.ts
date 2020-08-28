import {Injectable} from '@angular/core';
import {Observable, BehaviorSubject} from 'rxjs';
import {map} from 'rxjs/operators';

import * as moment from 'moment-timezone';
import {ApiService} from './api.service';
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {User} from '../../models/user.model';


@Injectable({
    providedIn: 'root'
})
export class AuthService implements Resolve<any> {

    user: User;
    model: any;

    onCurrentUserChange: BehaviorSubject<User> = new BehaviorSubject(this.user);
    onSysMessageChange: BehaviorSubject<any>;

    resolve(): Observable<User> {
        return this.getUser();
    }

    constructor(
        private apiService: ApiService,
    ) {
        this.user = new User();

        this.onSysMessageChange = new BehaviorSubject([]);
    }


    public isAuthenticated(): Promise<boolean> {
        return new Promise((resolve, reject) => {
            if (!localStorage.getItem('token') || !this.isExpiration) {
                resolve(false);
            } else if (this.isActive()) {
                this.getCurrentUserInfo().subscribe(
                    res => {
                        this.user = new User(res.data);
                        this.onCurrentUserChange.next(this.user);

                        resolve(true);
                    },
                    err => {
                        resolve(false);
                    }
                );
            } else {
                this.renewToken().subscribe(
                    res => {
                        if (res['data']) {
                            this.setSession(res['data']);
                        }

                        this.getCurrentUserInfo().subscribe(
                            resp => {
                                this.user = new User(resp.data);
                                this.onCurrentUserChange.next(this.user);

                                resolve(true);
                            },
                            err => {
                                resolve(false);
                            }
                        );
                    },
                    err => {
                        resolve(false);
                    }
                );
            }
        });
    }

    private renewToken() {
        return this.apiService.post('auth', 'update');
    }

    public login(username: string, password: string): Observable<any> {
        return this.apiService.post('auth', 'login', null, {'email': username, 'password': password});
    }


    public logout() {
        this.user = null;

        this.model = [];

        localStorage.removeItem('token');
        localStorage.removeItem('refresh_expires_at');
        localStorage.removeItem('expires_at');
        // this.activeContentService.endActiveContent();
    }

    public setSession(authResult) {
        const expiresAt = moment.tz(authResult['expires_in'], 'Australia/Melbourne');
        const activeAt = moment.tz(authResult['refresh_expires_at'], 'Australia/Melbourne');
        localStorage.setItem('token', authResult['access_token']);
        localStorage.setItem('refresh_expires_at', JSON.stringify(activeAt.valueOf()));
        localStorage.setItem('expires_at', JSON.stringify(expiresAt.valueOf()));
    }

    private getStorageTime(itemName: string) {
        try {
            const item = JSON.parse(localStorage.getItem(itemName));
            return moment(item);
        } catch (error) {
            this.logout();
        }
    }

    private isExpiration() {
        const expirationTime = this.getStorageTime('refresh_expires_at');
        const now = moment().subtract(1, 'm');
        if (now.isBefore(expirationTime)) {
            return true;
        } else {
            return false;
        }
    }

    private isActive() {
        const activeTime = this.getStorageTime('expires_at');
        const now = moment().subtract(1, 'm');
        if (now.isBefore(activeTime)) {
            return true;
        } else {
            return false;
        }
    }

    public updateCurrentUser() {
        this.apiService.get('auth', 'update').subscribe(
            res => {
                this.user = new User(res.data);
                this.onCurrentUserChange.next(this.user);
            }
        );
    }

    public getCurrentUserInfo(): Observable<any> {
        return this.apiService.get('auth', 'me');
    }

    public getCurrentUser() {
        return this.user;
    }

    public setCurrentUser(user) {
        this.user = user;
    }

    saveAccountInfo(sendData): Observable<any> {
        return this.apiService.put('auth', 'account/updateAccount', null, sendData);
    }
    saveNewUser(data): Observable<any> {
        return this.apiService.post('auth', 'users', null, data);
    }
    activeUser(data): Observable<any> {
        return this.apiService.put('auth', 'userStatus', null, data);
    }

    register(formValue: any): Observable<any> {
        return this.apiService.post('auth', 'signup', null, formValue);
    }

    updatePassword(oldPassword: string, newPassword: string): Observable<any> {
        return this.apiService.put('user', 'password', null, {old_password: oldPassword, password: newPassword});
    }

    getUsersByPage(data): Observable<any> {
        const query = data ? data : null;
        return this.apiService.get('auth', 'users/list', null, query );
    }
    getUser() {
        return this.apiService.get('auth', 'auth', null) as Observable<any>;
    }


}
