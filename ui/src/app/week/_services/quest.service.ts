import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivityService, TaskService } from '@app/_services';

@Injectable({
  providedIn: 'root'
})
export class QuestService {

  constructor(
    private http: HttpClient,
    private taskService: TaskService,
    private activityService: ActivityService,
  ) { }

  getAll() {
    // return this.http.get<an
  }
}
