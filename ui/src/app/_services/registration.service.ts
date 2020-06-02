import { Injectable } from '@angular/core'
import {HttpClient} from '@angular/common/http'
import {environment} from '@environments/environment'

@Injectable({
  providedIn: 'root'
})
export class RegistrationService {

  constructor(
    private http: HttpClient,
  ) { }

  /**
   * Sends new User data to API.
   * @param username for new User.
   * @param password for new User.
   * @param email for new User.
   */
  register(username: string, password: string, email: string) {
    return this.http.post<any>(`${environment.apiUrl}/users`, { username, password, email })
  }
}
