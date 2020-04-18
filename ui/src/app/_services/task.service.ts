import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '@environments/environment';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  constructor(
    private http: HttpClient,
  ) { }

  getAll() {
    return this.http.get<any>(`${environment.apiUrl}/tasks`)
      .pipe(map(tasks => {
        if (tasks._embedded && tasks._embedded.taskList) {
          return tasks._embedded.taskList;
        } else { return undefined; }
      })
    );
  }

  getById(id) {
    return this.http.get<any>(`${environment.apiUrl}/tasks/${id}`);
  }

  new(name: string, dueDateTime: Date, description: string, priority: string, shared: boolean) {
    return this.http.post<any>(`${environment.apiUrl}/tasks`,
      { name, dueDateTime, description, priority, shared });
  }
}
