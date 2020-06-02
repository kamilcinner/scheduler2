import { Component, OnInit } from '@angular/core'

import { TaskService} from '@app/task/_services'
import { Task } from '@app/task/_models'

@Component({
  selector: 'app-task-list',
  templateUrl: 'task-list.component.html',
  styleUrls: ['./task-list.component.css']
})
export class TaskListComponent implements OnInit {
  loading = true
  tasks: Task[]

  constructor(
    private taskService: TaskService,
  ) { }

  ngOnInit(): void {
    // Get Tasks data from server.
    const result = this.taskService.getAll()
    if (result) {
      result.subscribe(tasks => {
        // Check if there are tasks to display.
        if (tasks) {
          this.tasks = tasks
        }
        this.loading = false
      })
    } else { this.loading= false }
  }
}
