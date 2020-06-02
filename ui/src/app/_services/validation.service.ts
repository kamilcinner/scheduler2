import { Injectable } from '@angular/core'

@Injectable({
  providedIn: 'root'
})
export class ValidationService {

  constructor() { }

  /**
   * Checks if the id is a valid UUID.
   * Use it to prevent connecting to the API with an invalid id.
   * @param id (UUID string) which will be check.
   */
  public static checkUUID(id: string): boolean {
    return !!id.match('^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$');
  }
}
