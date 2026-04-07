import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { clearStoredAuth } from './auth-session.utils';

export const authErrorInterceptor: HttpInterceptorFn = (request, next) => {
  const router = inject(Router);

  return next(request).pipe(
    catchError((error: unknown) => {
      if (error instanceof HttpErrorResponse && (error.status === 401 || error.status === 403)) {
        clearStoredAuth();

        if (!router.url.startsWith('/login')) {
          router.navigate(['/login']);
        }
      }

      return throwError(() => error);
    })
  );
};
