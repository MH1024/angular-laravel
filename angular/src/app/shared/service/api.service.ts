import {HttpClient, HttpRequest, HttpErrorResponse, HttpHeaders} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import { throwError, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import {environment} from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class ApiService {
    private url: string;

    constructor(private httpClient: HttpClient) {
        this.url = environment.apiUrl;
    }

    public get(endpoint: string, target: string, param?: string, query?: any): Observable<any> {

        let resourceUrl = this.url + '/' + endpoint + '/' + target;
        if (param) {
            resourceUrl += '/' + param;
        }

        if (endpoint === 'auth') {
            resourceUrl = this.url + '/' + target;
        }

        return this.httpClient
            .get(resourceUrl, {params: query})
            .pipe(catchError((error: HttpErrorResponse) => of(this.handleError(error))));
    }

    public post(endpoint: string, target: string, param?: string, data?: any): Observable<any> {

        let resourceUrl = this.url + '/' + endpoint + '/' + target;
        if (endpoint === 'auth') {
            resourceUrl = this.url + '/' + target;
        }

        if (param) {
            resourceUrl += '/' + param;
        }

        return this.httpClient
            .post(resourceUrl, data)
            .pipe(catchError((error: HttpErrorResponse) => of(this.handleError(error))));
    }


    public put(endpoint: string, target: string, param?: string, data?: any): Observable<any> {

        let resourceUrl = this.url + '/' + endpoint + '/' + target;
        if (endpoint === 'auth') {
            resourceUrl = this.url + '/' + target;
        }

        if (param) {
            resourceUrl += '/' + param;
        }

        return this.httpClient
            .put(resourceUrl, data)
            .pipe(catchError((error: HttpErrorResponse) => of(this.handleError(error))));
    }

    public delete(endpoint: string, target: string, param?: string, data?: any): Observable<any> {

        let resourceUrl = this.url + '/' + endpoint + '/' + target;
        if (endpoint === 'auth') {
            resourceUrl = this.url + '/' + target;
        }

        if (param) {
            resourceUrl += '/' + param;
        }
        const httpOptions = {
            headers: new HttpHeaders({'Content-Type': 'application/json'}), body: data
        };

        return this.httpClient
            .delete(resourceUrl, httpOptions)
            .pipe(catchError((error: HttpErrorResponse) => of(this.handleError(error))));
    }

    private handleError(error: any): Observable<never> {
        error = error.error;
        const errMsg = (error.message) ? error.message : error.status ? `${error.status} - ${error.statusText}` : 'Server error';

        return throwError(error);
    }
}
