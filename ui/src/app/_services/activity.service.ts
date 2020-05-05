import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Activity } from '@app/_models';
import { map } from 'rxjs/operators';
import { environment } from '@environments/environment';
import { ValidationService } from '@app/_services/validation.service';

@Injectable({
  providedIn: 'root'
})
export class ActivityService {

  constructor(
    private http: HttpClient,
    private router: Router,
  ) { }

  // Checks if every Activity field send from API is in acceptable format.
  private static checkActivityTypes(activity): boolean {
    return !(typeof activity.id !== 'string' || typeof activity.ownerUsername !== 'string' || typeof activity.name !== 'string' ||
      typeof activity.description !== 'string' || typeof activity.timeStart !== 'string' || typeof activity.timeEnd !== 'string' ||
      typeof activity.date !== 'string' || typeof activity.statusActive !== 'boolean' || typeof activity.repeatWeekly !== 'boolean' ||
      typeof activity._links.self.href !== 'string');
  }

  // Returns proper Activity object created from API JSON.
  private static newActivityFromApiJSON(activity): Activity {
    return new Activity(activity.id, activity.ownerUsername, activity.name, activity.description,
      new Date('01/01/1900 ' + activity.timeStart), new Date('01/01/1900 ' + activity.timeEnd),
      new Date(activity.date), activity.statusActive, activity.repeatWeekly, activity._links.self.href);
  }

  // Get all Activities.
  getAll() {
    return this.http.get<any>(`${environment.apiUrl}/activities`)
      .pipe(map(activities => {
        if (activities._embedded && activities._embedded.activityList) {
          activities = activities._embedded.activityList;

          // Initialize Activities array.
          const newActivities: Activity[] = [];

          // Loop over JSON activityList.
          for (const activity of activities) {
            // Check if every field send from API is in acceptable format.
            if (!ActivityService.checkActivityTypes(activity)) {
              return this.push404();
            }

            // Add Activity to the Activities array.
            newActivities.push(ActivityService.newActivityFromApiJSON(activity));
          }
          return newActivities;
        } else { return this.push404(); }
      })
    );
  }

  // Get Activity by id.
  getOne(id: string) {
    if (ValidationService.checkUUID(id)) {
      return this.http.get<any>(`${environment.apiUrl}/activities/${id}`)
        .pipe(map(activity => {
          if (activity) {
            // Check if every field send from API is in acceptable format.
            if (!ActivityService.checkActivityTypes(activity)) {
              return this.push404();
            }

            // Return proper Activity object.
            return ActivityService.newActivityFromApiJSON(activity);
          } else { return this.push404(); }
        }));
    }
    return this.push404();
  }

  // Create or update Activity.
  // 'timeStart' and 'timeEnd' parameters must be provided as strings format.
  update(id: string, name: string, description: string, timeStart: string,
         timeEnd: string, date: Date, statusActive: boolean, repeatWeekly: boolean) {
    if (id) {
      if (ValidationService.checkUUID(id)) {
        return this.http.put<any>(`${environment.apiUrl}/activities/${id}`,
          { name, description, timeStart, timeEnd, date, statusActive, repeatWeekly });
      }
      return this.push404();
    } else {
      return this.http.post<any>(`${environment.apiUrl}/activities`,
        { name, description, timeStart, timeEnd, date, statusActive, repeatWeekly })
    }
  }

  // Delete Activity.
  delete(id: string) {
    if (ValidationService.checkUUID(id)) {
      return this.http.delete(`${environment.apiUrl}/activities/${id}`);
    }
    return this.push404();
  }

  private push404(): undefined {
    this.router.navigate(['/404']).then(r => console.log(r));
    return undefined;
  }
}
