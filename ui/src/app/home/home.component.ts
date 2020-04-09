import { Component, OnInit } from '@angular/core';

import { TaskService} from '@app/_services/task.service';
import { Task } from '@app/_models';

@Component({
  templateUrl: 'home.component.html'
})
export class HomeComponent implements OnInit {
  tasks: Array<Task> = [];
  loading = false;

  constructor(
    private taskService: TaskService,
  ) { }

  ngOnInit() {
    this.loading = true;
    // Get Tasks data from server.
    this.taskService.getAll().subscribe(tasks => {
      // Loop over JSON taskList.
      for (const task of tasks) {
        // Create new Task.
        const t = new Task(task.id, task.name, task._links.self.href);
        // Log.
        console.warn('New Task', t); // TODO delete this
        // Add Task to the tasks Array.
        this.tasks.push(t);
      }
    });
    this.loading = false;
  }
}
