import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})

export class ErrorHandlerService {
  public errorMessage = '';

  constructor(private router: Router) { }

  public flatErrors(errorsObj) {
    const fieldArray = ['name', 'password', 'email'];
    let innerDiv = '<ul>';
    for (const fieldName of fieldArray) {
      if (errorsObj[fieldName] && Array.isArray(errorsObj[fieldName])) {
        innerDiv += errorsObj[fieldName].reduce((accumulator, currentValue) => {
          const itemDiv = '<li>' + currentValue + '</li>';
          return accumulator + itemDiv;
        }, '');
      }
    }
    innerDiv += '</ul>';
    return innerDiv;
  }

  public handleError(error: any) {
    if (error.status_code === 500) {
      this.handle500Error(error);
    } else if (error.status_code === 404) {
      this.handle404Error(error);
    } else {
      this.handleOtherError(error);
    }
  }

  private handle500Error(error: any) {
    this.createErrorMessage(error);
    this.router.navigate(['/500']);
  }

  private handle404Error(error: any) {
    this.createErrorMessage(error);
    this.router.navigate(['/404']);
  }

  private handleOtherError(error) {
    this.createErrorMessage(error);
  }

  private createErrorMessage(error) {
    this.errorMessage = error.message ? error.message : 'Opps, Something Wrong.';
  }
}
