import { Injectable } from '@angular/core'
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http'
import { Observable, throwError } from 'rxjs'
import { catchError } from 'rxjs/operators'

import { AuthenticationService } from '@app/_services'
import { Router } from '@angular/router'
import { PageNotFound } from '@app/_helpers/page-not-found';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

  constructor(
    private router: Router,
    private authenticationService: AuthenticationService
  ) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(catchError(err => {
      let errors

      switch (err.status) {
        case 401: {
          // Auto logout if 401 response returned from api.
          this.authenticationService.logout()

          const errorMessage = 'Authorization error. Probably Your token has expired. Please log in again.'

          this.router.navigate(['/login'], { queryParams: { authenticationError: errorMessage } }).then(
            () => console.warn('User token is invalid or has expired. Logged out.')
          )
          errors = { server: errorMessage }
          break
        }

        case 400: {
          const errs = err.error.errors || null

          // If null there is no errors related to Object fields.
          // Eg. Task, Activity, Shopping list, Item.
          if (errs) {
            errors = {
              username: undefined,
              password: undefined,
              email: undefined,
              name: undefined,
              description: undefined,
              priority: undefined
            }

            const usernameErrors = []
            const passwordErrors = []
            const emailErrors = []
            const nameErrors = []
            const descriptionErrors = []
            const priorityErrors = []

            for (const e of errs) {
              const msg = e.defaultMessage

              if (e.field === 'username') {
                usernameErrors.push(msg)
              } else if (e.field === 'password') {
                passwordErrors.push(msg)
              } else if (e.field === 'email') {
                emailErrors.push(msg)
              } else if (e.field === 'name') {
                nameErrors.push(msg)
              } else if (e.field === 'description') {
                descriptionErrors.push(msg)
              } else if (e.field === 'priority') {
                priorityErrors.push(msg)
              }
            }

            if (usernameErrors.length > 0) { errors.username = usernameErrors }
            if (passwordErrors.length > 0) { errors.password = passwordErrors }
            if (emailErrors.length > 0) { errors.email = emailErrors }
            if (nameErrors.length > 0) { errors.name = nameErrors }
            if (descriptionErrors.length > 0) { errors.description = descriptionErrors }
            if (priorityErrors.length > 0) { errors.priority = priorityErrors }
          }
          else { errors = { server: err.error.message } }
          break
        }

        case 404: {
          PageNotFound.redirect(this.router)
          errors = { server: 'Page not found.' }
          break
        }

        case 500: {
          errors = { server: 'Internal server error 500.' }
          break
        }

        default: {
          errors = { server: err.error.message }
            || { server: err.statusText }
            || { server: 'Server connection error.' }
        }
      }

      // Throw errors.
      return throwError(errors)
    }))
  }
}
