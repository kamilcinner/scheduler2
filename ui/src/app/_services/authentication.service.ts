import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { BehaviorSubject, Observable } from 'rxjs'
import { map } from 'rxjs/operators'

import { environment } from '@environments/environment'
import { User } from '@app/_models'

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  currentUser: Observable<User>
  private currentUserSubject: BehaviorSubject<User>

  constructor(
    private http: HttpClient,
  ) {
    this.currentUserSubject = new BehaviorSubject<User>(
      JSON.parse(localStorage.getItem('currentUser'))
    )
    this.currentUser = this.currentUserSubject.asObservable()
  }

  public get currentUserValue(): User {
    return this.currentUserSubject.value
  }

  /**
   * Sends User credentials to the API requesting new Authorization token.
   * @param username User name.
   * @param password User password.
   */
  login(username: string, password: string) {
    return this.http.post<any>(`${environment.apiUrl}/login`, { username, password })
      .pipe(map(user => {
        // Store user details and jwt token in local storage to keep user logged in between page refreshes.
        localStorage.setItem('currentUser', JSON.stringify(user))
        console.warn('User stored in local mem.', user)

        // Update current User subject.
        this.currentUserSubject.next(user)
        return user
      }))
  }

  /**
   * Logout the User.
   */
  logout() {
    // Remove user from local storage to log user out.
    localStorage.removeItem('currentUser')

    // Update current User subject value.
    this.currentUserSubject.next(null)
  }

  public get authenticated(): boolean {
    return !!this.currentUserValue
  }
}
