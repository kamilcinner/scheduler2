import { Component, OnInit } from '@angular/core';
import { TaskService } from '@app/_services';
import { Task } from '@app/_models';
import { ActivatedRoute, Router } from '@angular/router';

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
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loading = true;

    // Get Task id from URL.
    let id;
    this.route.paramMap.subscribe(params => {
      id = params.get('id');
    });

    // Get Task data from server.
    const result = this.taskService.getOne(id);
    if (result) {
      result.subscribe(task => {
        // Check if there is a Task.
        if (task) {
          // Save Task to component object.
          this.task = new Task(task.id, task.name, new Date(task.dueDateTime),
            task.description, task.priority, task.done, task.shared,
            task._links.self.href);

          // Log.
          // TODO: delete this
          console.warn('New Task', this.task);
        }
      });
    }

    this.loading = false;
  }

  // Change Task shared status to opposite.
  onShare(): void {
    const result = this.taskService.share(this.task.id);
    if (result) {
      result.subscribe(
        _ => this.task.negateShare()
      );
    }
  }

  // Change Task done status to opposite.
  onMark(): void {
    const result = this.taskService.mark(this.task.id);
    if (result) {
      result.subscribe(
        _ => this.task.negateDone()
      );
    }
  }

  // Delete Task.
  onDelete(): void {
    const result = this.taskService.delete(this.task.id);
    if (result) {
      result.subscribe(
        _ => this.router.navigate(['/tasks'])
      );
    }
  }

}
