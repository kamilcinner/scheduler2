import { Component, OnInit } from '@angular/core';

import { TaskService} from '@app/_services/task.service';
import { Task } from '@app/_models';

@Component({
  templateUrl: 'task-list.component.html'
})
export class TaskListComponent implements OnInit {
  tasks;
  loading = false;

  constructor(
    private taskService: TaskService,
  ) { }

  // Load tasks from server.
  ngOnInit() {
    this.loading = true;
    // Get Tasks data from server.
    this.taskService.getAll().subscribe(tasks => {
      // Check if there are tasks to display.
      if (tasks) {
        this.tasks = [];
        // Loop over JSON taskList.
        for (const task of tasks) {
          // Create new Task.
          const t = new Task(task.id, task.name, new Date(task.dueDateTime), task.description,
            task.priority, task.status, task.shared, task._links.self.href);
          // Log.
          console.warn('New Task', t); // TODO: delete this
          // Add Task to the tasks Array.
          this.tasks.push(t);
        }
      }
    });
    this.loading = false;
  }
}
