import { Component, OnInit } from '@angular/core';
import { TaskService } from '@app/_services';
import { Task } from '@app/_models';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-task-detail',
  templateUrl: './task-detail.component.html',
  styleUrls: ['./task-detail.component.css']
})
export class TaskDetailComponent implements OnInit {
  task: Task;
  loading = false;

  constructor(
    private route: ActivatedRoute,
    private taskService: TaskService,
  ) { }

  ngOnInit(): void {
    this.loading = true;

    // Get task id from URL.
    let id;
    this.route.paramMap.subscribe(params => {
      id = params.get('id');
    });

    // Get Task data from server.
    this.taskService.getById(id).subscribe(task => {
      // Check if there are tasks to display.
      if (task) {
        // Create new Task.
        this.task = new Task(task.id, task.name, new Date(task.dueDateTime),
          task.description, task.priority, task.status, task.shared,
          task._links.self.href);

        // Log.
        // TODO: delete this
        console.warn('New Task', this.task);
      }
    });
    this.loading = false;
  }

}
