import {Injectable} from '@angular/core';
import {Observable, BehaviorSubject} from 'rxjs';
import {map} from 'rxjs/operators';

import * as moment from 'moment-timezone';
import {ApiService} from './api.service';
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {User} from '../../models/user.model';
import {environment} from '../../../environments/environment';


@Injectable({
    providedIn: 'root'
})
export class AuthService implements Resolve<any> {

    user: User;
    model: any;
    serverUrl = environment.apiUrl;
    private iss = {
        login: this.serverUrl + '/login',
        signup: this.serverUrl + '/signup'
    };
    onCurrentUserChange: BehaviorSubject<User> = new BehaviorSubject(this.user);
    onSysMessageChange: BehaviorSubject<any>;

    resolve(): Observable<User> {
        return this.getCurrentUserInfo();
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
                        this.user = new User(res);
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
                        if (res) {
                            this.setSession(res);
                        }

                        this.getCurrentUserInfo().subscribe(
                            resp => {
                                this.user = new User(resp);
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

    private getToken() {
        return localStorage.getItem('token');
    }

    public removeToken() {
        return localStorage.removeItem('token');
    }

    private renewToken(): Observable<any> {
        return this.apiService.post('auth', 'refresh');
    }

    private payload(token)  {
        const payload = token.split('.')[1];
        return this.decode(payload);
    }

    private decode(payload) {
        // decodes a base-64 encoded string to get token expire info.
        return JSON.parse(atob(payload));
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
    }
    private isValidTokenUrl(payload) {
        if (payload) {
            const isFromServerUrl = (payload.iss && (Object.values(this.iss).indexOf(payload.iss) > -1)) ? true : false;
            return isFromServerUrl;
        } else {
            return false;
        }
    }

    public setSession(authResult) {
        const tokenPayload = this.payload(authResult['token']);
        const isValid = this.isValidTokenUrl(tokenPayload);
        if (isValid) {
            const expiresAtDate  = new Date(Number(tokenPayload['exp']) * 1000);
            const activeAtDate  = new Date(Number(tokenPayload['iat']) * 1000);
            const expiresAt = moment.tz(expiresAtDate, 'Australia/Melbourne');
            const activeAt = moment.tz(activeAtDate, 'Australia/Melbourne');
            localStorage.setItem('token', authResult['token']);
            localStorage.setItem('refresh_expires_at', JSON.stringify(activeAt.valueOf()));
            localStorage.setItem('expires_at', JSON.stringify(expiresAt.valueOf()));
            return true;
        } else {
            this.logout();
            return false;
        }
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
        this.apiService.get('auth', 'me').subscribe(
            res => {
                this.user = new User(res);
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
    saveUser(action, data): Observable<any> {
        if (action && action === 'edit') {
            return this.apiService.post('auth', 'update-user', null, data);
        } else {
            return this.apiService.post('auth', 'create-user', null, data);
        }
    }

    deleteUser(data): Observable<any> {
        return this.apiService.delete('auth', 'delete-user', null, data);
    }
    changeProfile(data): Observable<any> {
        return this.apiService.put('auth', 'update-profile', null, data);
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

    getUserList(data): Observable<any> {
        const query = data ? data : null;
        return this.apiService.get('auth', 'users-list', null, query );
    }

    changePassword(data): Observable<any> {
        return this.apiService.post('auth', 'update-password', null, data);
    }

}
