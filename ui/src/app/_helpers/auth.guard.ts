import { Injectable } from '@angular/core'
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router'

import { AuthenticationService } from '@app/_services'

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    private router: Router,
    private authenticationService: AuthenticationService
  ) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const currentUser = this.authenticationService.currentUserValue
    if (currentUser) {
      // User is logged in so return true.
      return true
    }

    // User is not logged in so redirect to login page with the return url.
    this.router.navigate(['/login'], { queryParams: { returnUrl: state.url } })
      .then(() => console.warn('You must be logged in to access this page!'))
    return false
  }
}
