import { Component, OnInit } from '@angular/core';
import { AuthenticationService, TaskService } from '@app/_services';
import { Task } from '@app/_models';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-task-detail',
  templateUrl: './task-detail.component.html',
  styleUrls: ['./task-detail.component.css']
})
export class TaskDetailComponent implements OnInit {
  task: Task;
  loadingShareBtn = false;
  loadingMarkBtn = false;
  loadingDetail = true;
  hideDelete = true;

  constructor(
    private route: ActivatedRoute,
    private taskService: TaskService,
    private router: Router,
    private authenticationService: AuthenticationService
  ) { }

  ngOnInit(): void {
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
          this.task = task;

          // Log.
          // TODO: delete this
          console.warn('New Task', this.task);
        }
        this.loadingDetail = false;
      });
    }

  }

  // Change Task shared status to opposite.
  onShare(): void {
    this.loadingShareBtn = true;
    const result = this.taskService.share(this.task.id);
    if (result) {
      result.subscribe(
        _ => {
          this.task.negateShare();
          this.loadingShareBtn = false;
        }
      );
    }
  }

  // Change Task done status to opposite.
  onMark(): void {
    this.loadingMarkBtn = true;
    const result = this.taskService.mark(this.task.id);
    if (result) {
      result.subscribe(
        _ => {
          this.task.negateDone();
          this.loadingMarkBtn = false;
        }
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

  onShowDeleteConfirmation(): void {
    this.hideDelete = false;
  }

  onHideDeleteConfirmation(): void {
    this.hideDelete = true;
  }

  get authenticated(): boolean {
    return !!this.authenticationService.currentUserValue;
  }

  get currentUserIsOwner(): boolean {
    if (!this.authenticated) {
      return false;
    }
    if (this.task.ownerUsername !== this.authenticationService.currentUserValue.username) {
      return false;
    }
    return true;
  }

}
