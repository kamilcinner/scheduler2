import { Component, OnInit } from '@angular/core';

import { TaskService} from '@app/_services/task.service';
import { Task } from '@app/_models';

@Component({
  selector: 'app-task-list',
  templateUrl: 'task-list.component.html',
  styleUrls: ['./task-list.component.css']
})
export class TaskListComponent implements OnInit {
  tasks: Task[];
  loading = false;

  constructor(
    private taskService: TaskService,
  ) { }

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
          const newTask = new Task(task.id, task.name, new Date(task.dueDateTime),
            task.description, task.priority, task.status, task.shared,
            task._links.self.href);

          // Log.
          // TODO: delete this
          console.warn('New Task', newTask);

          // Add Task to the tasks Array.
          this.tasks.push(newTask);
        }
      }
    });
    this.loading = false;
  }
}
