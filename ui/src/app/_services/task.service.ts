import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '@environments/environment';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  constructor(
    private http: HttpClient,
    private router: Router
  ) { }

  // Checks if the id is a valid UUID.
  // Use it to prevent connecting to the API with an invalid id.
  private static checkUUID(id: string): boolean {
    if (id.match('^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$')) {
      return true;
    }
    return false;
  }

  // Get all Tasks.
  getAll() {
    return this.http.get<any>(`${environment.apiUrl}/tasks`)
      .pipe(map(tasks => {
        if (tasks._embedded && tasks._embedded.taskList) {
          return tasks._embedded.taskList;
        } else { return undefined; } // TODO: check if this is important
      })
    );
  }

  // Get Task by id.
  getOne(id: string) {
    if (TaskService.checkUUID(id)) {
      return this.http.get<any>(`${environment.apiUrl}/tasks/${id}`);
    }
    this.router.navigate(['/404']).then(r => console.log(r));
  }

  // Create or update Task.
  update(id: string, name: string, dueDateTime: Date, description: string, priority: string) {
    if (id) {
      if (TaskService.checkUUID(id)) {
        return this.http.put<any>(`${environment.apiUrl}/tasks/${id}`,
          { name, dueDateTime, description, priority });
      }
      this.router.navigate(['/404']).then(r => console.log(r));
    } else {
      return this.http.post<any>(`${environment.apiUrl}/tasks`,
        { name, dueDateTime, description, priority });
    }
  }

  // Delete Task.
  delete(id: string) {
    if (TaskService.checkUUID(id)) {
      return this.http.delete(`${environment.apiUrl}/tasks/${id}`);
    }
    this.router.navigate(['/404']).then(r => console.log(r));
  }

  // Share/Un share Task.
  share(id: string) {
    if (TaskService.checkUUID(id)) {
      return this.http.get(`${environment.apiUrl}/tasks/share/${id}`);
    }
    this.router.navigate(['/404']).then(r => console.log(r));
  }

  // Mark Task done/undone.
  mark(id: string) {
    if (TaskService.checkUUID(id)) {
      return this.http.get(`${environment.apiUrl}/tasks/mark/${id}`);
    }
    this.router.navigate(['/404']).then(r => console.log(r));
  }
}
