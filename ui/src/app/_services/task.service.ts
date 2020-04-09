import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '@environments/environment';
import { Task } from '@app/_models';
import {filter, map} from 'rxjs/operators';
import {BehaviorSubject, Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  constructor(
    private http: HttpClient,
  ) { }

  getAll() {
    return this.http.get<any>(`${environment.apiUrl}/tasks`).pipe(
      map(tasks => tasks._embedded.taskList)
    );
  }
}
