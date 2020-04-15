import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { AuthenticationService } from '@app/_services';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(
    private authenticationService: AuthenticationService
  ) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(catchError(err => {
      if (err.status === 401) {
        // auto logout if 401 response returned from api
        this.authenticationService.logout();
        location.reload(true);

      } else if (err.status === 400) {
        const es = err.error.errors || null;

        if (es) {
          const errors = {
            username: undefined,
            password: undefined,
            email: undefined
          };

          const usernameErrors = [];
          const passwordErrors = [];
          const emailErrors = [];

          for (const e of es) {
            const msg = e.defaultMessage;

            if (e.field === 'username') {
              usernameErrors.push(msg);
            } else if (e.field === 'password') {
              passwordErrors.push(msg);
            } else if (e.field === 'email') {
              emailErrors.push(msg);
            }
          }

          if (usernameErrors.length > 0) { errors.username = usernameErrors; }
          if (passwordErrors.length > 0) { errors.password = passwordErrors; }
          if (emailErrors.length > 0) { errors.email = emailErrors; }

          return throwError(errors);
        }
      }

      const error = err.error.message || err.statusText;
      return throwError(error);
    }));
  }
}
