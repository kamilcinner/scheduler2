import { Component, OnInit } from '@angular/core';

import { TaskService} from '@app/_services';
import { Task } from '@app/_models';

@Component({
  selector: 'app-task-list',
  templateUrl: 'task-list.component.html',
  styleUrls: ['./task-list.component.css']
})
export class TaskListComponent implements OnInit {
  loading = true;
  tasks: Task[];

  constructor(
    private taskService: TaskService,
  ) { }

  ngOnInit() {
    // Get Tasks data from server.
    const result = this.taskService.getAll();
    if (result) {
      result.subscribe(tasks => {
        // Check if there are tasks to display.
        if (tasks) {
          this.tasks = tasks;
        }
        this.loading = false;
      });
    }
  }
}
