import { Component, OnInit } from '@angular/core'
import { AuthenticationService } from '@app/_services'
import { TaskService } from '@app/task/_services'
import { Task } from '@app/task/_models'
import { ActivatedRoute, Router } from '@angular/router'
import { PageNotFound } from '@app/_helpers';

@Component({
  selector: 'app-task-detail',
  templateUrl: './task-detail.component.html',
  styleUrls: ['./task-detail.component.css']
})
export class TaskDetailComponent implements OnInit {
  task: Task
  loadingShareBtn = false
  loadingMarkBtn = false
  loadingDetail = true
  hideDelete = true

  constructor(
    private route: ActivatedRoute,
    private taskService: TaskService,
    private router: Router,
    private authenticationService: AuthenticationService
  ) { }

  ngOnInit(): void {
    // Get Task id from URL.
    let id = ''
    this.route.paramMap.subscribe(params => {
      id = params.get('id')
    })

    // Get Task data from server.
    const result = this.taskService.getOne(id)
    if (result) {
      result.subscribe(task => {
        // Check if there is a Task.
        if (task) {
          // Save Task to component object.
          this.task = task
        }
        // If API can't return proper Task for some reason and doesn't throw any error by itself.
        else {
          PageNotFound.redirect(this.router)
        }
        this.loadingDetail = false
      })
    }
    // If id is an invalid UUID.
    else {
      PageNotFound.redirect(this.router)
    }
  }

  // Change Task shared status to opposite.
  onShare(): void {
    this.loadingShareBtn = true
    const result = this.taskService.share(this.task.id)
    if (result) {
      result.subscribe(
        () => {
          this.task.negateShare()
          console.log(`Shared/Unshared Task ${this.task.id}.`)
          this.loadingShareBtn = false
        }
      )
    }
    // If id is an invalid UUID.
    else {
      PageNotFound.redirect(this.router)
    }
  }

  // Change Task done status to opposite.
  onMark(): void {
    this.loadingMarkBtn = true
    const result = this.taskService.mark(this.task.id)
    if (result) {
      result.subscribe(
        () => {
          this.task.negateDone()
          console.log(`Marked Task ${this.task.id}.`)
          this.loadingMarkBtn = false
        }
      )
    }
    // If id is an invalid UUID.
    else {
      PageNotFound.redirect(this.router)
    }
  }

  // Delete Task.
  onDelete(): void {
    const result = this.taskService.delete(this.task.id)
    if (result) {
      result.subscribe(
        () => this.router.navigate(['/tasks']).then(
          () => console.log(`Deleted Task ${this.task.id}.`)
        )
      )
    }
    // If id is an invalid UUID.
    else {
      PageNotFound.redirect(this.router)
    }
  }

  onShowDeleteConfirmation(): void {
    this.hideDelete = false
  }

  onHideDeleteConfirmation(): void {
    this.hideDelete = true
  }

  get authenticated(): boolean {
    return this.authenticationService.authenticated
  }

  get currentUserIsOwner(): boolean {
    if (!this.authenticated) {
      return false
    }
    return this.task.ownerUsername === this.authenticationService.currentUserValue.username;
  }

}
