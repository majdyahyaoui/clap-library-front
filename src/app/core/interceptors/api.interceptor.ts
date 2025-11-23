import {
  HttpInterceptorFn,
  HttpRequest,
  HttpHandlerFn,
  HttpEvent,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Injectable, inject } from '@angular/core';

export const apiInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> => {
  // Clone request and add headers
  const clonedReq = req.clone({
    setHeaders: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
  });

  return next(clonedReq).pipe(
    catchError((error: HttpErrorResponse) => {
      console.error('API Error:', error);
      return throwError(() => error);
    })
  );
};
