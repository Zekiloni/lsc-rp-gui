import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { ApiError } from '../model/apiError';

export const apiErrorInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req)
     .pipe(
        catchError((response: HttpErrorResponse): Observable<never> => {
          const apiError: ApiError = response.error ? response.error : createApiError(response);
          console.error(response)
          return throwError(() => apiError);
        })
     );
};

const createApiError = (response: HttpErrorResponse): ApiError => {
  return {
    code: response.status.toString(),
    status: response.status.toString(),
    message: response.message,
    reason: response.name,
  };
}