import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { AuthenticationService } from '@app/_services';
import { Router } from '@angular/router';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(
    private router: Router,
    private authenticationService: AuthenticationService
  ) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(catchError(err => {
      if (err.status === 401) {
        // Auto logout if 401 response returned from api.
        this.authenticationService.logout();
        this.router.navigate(['/login']);

      } else if (err.status === 400) {
        const errs = err.error.errors || null;

        if (errs) {
          const errors = {
            username: undefined,
            password: undefined,
            email: undefined,
            name: undefined,
            description: undefined,
            priority: undefined
          };

          const usernameErrors = [];
          const passwordErrors = [];
          const emailErrors = [];
          const nameErrors = [];
          const descriptionErrors = [];
          const priorityErrors = [];

          for (const e of errs) {
            const msg = e.defaultMessage;

            if (e.field === 'username') {
              usernameErrors.push(msg);
            } else if (e.field === 'password') {
              passwordErrors.push(msg);
            } else if (e.field === 'email') {
              emailErrors.push(msg);
            } else if (e.field === 'name') {
              nameErrors.push(msg);
            } else if (e.field === 'description') {
              descriptionErrors.push(msg);
            } else if (e.field === 'priority') {
              priorityErrors.push(msg);
            }
          }

          if (usernameErrors.length > 0) { errors.username = usernameErrors; }
          if (passwordErrors.length > 0) { errors.password = passwordErrors; }
          if (emailErrors.length > 0) { errors.email = emailErrors; }
          if (nameErrors.length > 0) { errors.name = nameErrors; }
          if (descriptionErrors.length > 0) { errors.description = descriptionErrors; }
          if (priorityErrors.length > 0) { errors.priority = priorityErrors; }

          return throwError(errors);
        }
      } else if (!err.status) {
        const error = 'Server connection error.';
        return throwError(error);
      } else if (err.status === 404) {
        this.router.navigate(['/404']).then(r => console.log(r));
      } else if (err.status === 500) {
        const error = 'Internal server error 500.';
        return throwError(error);
      } else {
        const error = err.error.message || err.statusText;
        return throwError(error);
      }
    }));
  }
}
