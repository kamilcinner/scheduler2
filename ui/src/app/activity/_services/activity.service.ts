import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Activity } from '@app/activity/_models'
import { map } from 'rxjs/operators'
import { environment } from '@environments/environment'
import { ValidationService } from '@app/_services/validation.service'

@Injectable({
  providedIn: 'root'
})
export class ActivityService {

  constructor(
    private http: HttpClient
  ) { }

  // Checks if every Activity field send from API is in acceptable format.
  private static checkActivityTypes(activity): boolean {
    return !(typeof activity.id !== 'string' || typeof activity.ownerUsername !== 'string' || typeof activity.name !== 'string' ||
      typeof activity.description !== 'string' || typeof activity.timeStart !== 'string' || typeof activity.timeEnd !== 'string' ||
      typeof activity.date !== 'string' || typeof activity.statusActive !== 'boolean' || typeof activity.repeatWeekly !== 'boolean' ||
      typeof activity._links.self.href !== 'string')
  }

  // Returns proper Activity object created from API JSON.
  private static newActivityFromApiJSON(activity): Activity {
    const newActivity = new Activity(activity.id, activity.ownerUsername, activity.name, activity.description,
      new Date('01/01/1900 ' + activity.timeStart), new Date('01/01/1900 ' + activity.timeEnd),
      new Date(activity.date), activity.statusActive, activity.repeatWeekly, activity._links.self.href)
    console.log('Saved Activity', newActivity)
    return newActivity
  }

  /**
   * Gets all Activities from API.
   */
  getAll() {
    return this.http.get<any>(`${environment.apiUrl}/activities`)
      .pipe(map(activities => {
        if (activities._embedded && activities._embedded.activityList) {
          activities = activities._embedded.activityList

          // Initialize Activities array.
          const newActivities: Activity[] = []

          // Loop over JSON activityList.
          for (const activity of activities) {
            // Check if every field send from API is in acceptable format.
            if (!ActivityService.checkActivityTypes(activity)) {
              return null
            }

            // Add Activity to the Activities array.
            newActivities.push(ActivityService.newActivityFromApiJSON(activity))
          }
          return newActivities
        } else { return null }
      })
    )
  }

  /**
   * Gets Activity by id from API.
   * @param id (UUID string) of demanded Activity.
   * @return Observable or null if id is an invalid UUID.
   */
  getOne(id: string) {
    if (ValidationService.checkUUID(id)) {
      return this.http.get<any>(`${environment.apiUrl}/activities/${id}`)
        .pipe(map(activity => {
          if (activity) {
            // Check if every field send from API is in acceptable format.
            if (!ActivityService.checkActivityTypes(activity)) {
              return null
            }

            // Return proper Activity object.
            return ActivityService.newActivityFromApiJSON(activity)
          } else { return null }
        }))
    }
    // If id is an invalid UUID.
    return null
  }

  /**
   * Creates or updates Activity.
   * @param id (UUID string) if update or null if a new Activity should be created.
   * @param name (string) name of the Activity.
   * @param description (string) description of the Activity.
   * @param timeStart (time string) time when the Activity is starting.
   * @param timeEnd (time string) time when the Activity is ending.
   * @param date (Date) date when the Activity occurs.
   * @param statusActive (boolean) true if the Activity should be displayed in Week Schedule.
   * @param repeatWeekly (boolean) true if the Activity should be displayed every week in Week Schedule.
   * @return Observable with optional Activity or null if id is an invalid UUID.
   */
  update(id: string, name: string, description: string, timeStart: string,
         timeEnd: string, date: Date, statusActive: boolean, repeatWeekly: boolean) {

    // If id is specified then update an existing Activity.
    if (id) {
      if (ValidationService.checkUUID(id)) {
        return this.http.put<any>(`${environment.apiUrl}/activities/${id}`,
          { name, description, timeStart, timeEnd, date, statusActive, repeatWeekly })
      }
      // If id is an invalid UUID.
      return null
    }
    // If a new Activity should be created.
    else {
      return this.http.post<any>(`${environment.apiUrl}/activities`,
        { name, description, timeStart, timeEnd, date, statusActive, repeatWeekly })
    }
  }

  /**
   * Deletes Activity from API.
   * @param id (UUID string) of Activity to delete.
   * @return Observable or null if id is an invalid UUID.
   */
  delete(id: string) {
    if (ValidationService.checkUUID(id)) {
      return this.http.delete(`${environment.apiUrl}/activities/${id}`)
    }
    // If id is an invalid UUID.
    return null
  }

  /**
   * Adds university subjects to User Activities in API.
   */
  addActivitiesFromPollub() {
    return this.http.get(`${environment.apiUrl}/activities/pollub`)
  }
}
