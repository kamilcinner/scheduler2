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
}
