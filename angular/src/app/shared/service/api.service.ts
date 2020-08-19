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
            .pipe(
                catchError(this.handleError)
            );
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
            .pipe(
                catchError(this.handleError)
            );
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
            .pipe(
                catchError(this.handleError)
            );
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
            .pipe(
                catchError(this.handleError)
            );
    }

    private handleError(error): Observable<never> {

        let errorMessage;
        if (error.error instanceof ErrorEvent) {
            // A client-side or network error occurred. Handle it accordingly.
            console.error('An error occurred:', error.error.message);
            errorMessage = error.error.message;
        } else if (error.errors instanceof ErrorEvent) {
            {
                // The backend returned an unsuccessful response code.
                // The response body may contain clues as to what went wrong,
                console.error(
                    `Backend returned code ${error.status}, ` +
                    `body was: ${error.errors}`);
                errorMessage = error.errors;
            }
        } else {
            // The backend returned an unsuccessful response code.
            // The response body may contain clues as to what went wrong,
            console.error(
                `Backend returned code ${error.status}, ` +
                `body was: ${error.error}`);
            errorMessage = error;
        }

        // return an observable with a user-facing error message
        return throwError(errorMessage);
    }
}
