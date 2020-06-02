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

  register(username: string, password: string, email: string) {
    return this.http.post<any>(`${environment.apiUrl}/users`, { username, password, email })
  }
}
