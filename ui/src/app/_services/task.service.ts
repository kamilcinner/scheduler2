import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'

import { environment } from '@environments/environment'
import { map } from 'rxjs/operators'
import { Router } from '@angular/router'
import { Task } from '@app/_models'
import { AuthenticationService } from '@app/_services/authentication.service'
import { ValidationService } from '@app/_services/validation.service'

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  constructor(
    private http: HttpClient,
    private router: Router,
    private authenticationService: AuthenticationService
  ) { }

  // Checks if every Task field send from API is in acceptable format.
  private static checkTaskTypes(task): boolean {
    return !(typeof task.id !== 'string' || typeof task.ownerUsername !== 'string' || typeof task.name !== 'string' ||
      typeof task.dueDateTime !== 'string' || typeof task.description !== 'string' || typeof task.priority !== 'string' ||
      typeof task.done !== 'boolean' || typeof task.shared !== 'boolean' ||
      typeof task._links.self.href !== 'string')
  }

  // Returns proper Task object created from API JSON.
  private static newTaskFromApiJSON(task): Task {
    const newTask = new Task(task.id, task.ownerUsername, task.name, new Date(task.dueDateTime),
      task.description, task.priority, task.done, task.shared,
      task._links.self.href)
    console.log('Saved Task', newTask)
    return newTask
  }

  // Get all Tasks.
  getAll() {
    return this.http.get<any>(`${environment.apiUrl}/tasks`)
      .pipe(map(tasks => {
        if (tasks._embedded && tasks._embedded.taskList) {
          tasks = tasks._embedded.taskList

          // Initialize Tasks array.
          const newTasks: Task[] = []

          // Loop over JSON taskList.
          for (const task of tasks) {
            // Check if every field send from API is in acceptable format.
            if (!TaskService.checkTaskTypes(task)) {
              return this.push404()
            }

            // Add Task to the Tasks array.
            newTasks.push(TaskService.newTaskFromApiJSON(task))
          }
          return newTasks
        } else { return null }
      })
    )
  }

  // Get Task by id.
  getOne(id: string) {
    if (ValidationService.checkUUID(id)) {
      const url: string = `${environment.apiUrl}/tasks/` +
        (this.authenticated ? '' : 'shared/') + `${id}`

      return this.http.get<any>(url)
        .pipe(map(task => {
          if (task) {
            // Check if every field send from API is in acceptable format.
            if (!TaskService.checkTaskTypes(task)) {
              return this.push404()
            }

            // Return proper Task object.
            return TaskService.newTaskFromApiJSON(task)
          } else { return this.push404() }
        }))
    }
    return this.push404()
  }

  // Create or update Task.
  update(id: string, name: string, dueDateTime: Date, description: string, priority: string) {
    if (id) {
      if (ValidationService.checkUUID(id)) {
        return this.http.put<any>(`${environment.apiUrl}/tasks/${id}`,
          { name, dueDateTime, description, priority })
      }
      return this.push404()
    } else {
      return this.http.post<any>(`${environment.apiUrl}/tasks`,
        { name, dueDateTime, description, priority })
    }
  }

  // Delete Task.
  delete(id: string) {
    if (ValidationService.checkUUID(id)) {
      return this.http.delete(`${environment.apiUrl}/tasks/${id}`)
    }
    return this.push404()
  }

  // Share/Unshare Task.
  share(id: string) {
    if (ValidationService.checkUUID(id)) {
      return this.http.get(`${environment.apiUrl}/tasks/share/${id}`)
    }
    return this.push404()
  }

  // Mark Task done/undone.
  mark(id: string) {
    if (ValidationService.checkUUID(id)) {
      return this.http.get(`${environment.apiUrl}/tasks/mark/${id}`)
    }
    return this.push404()
  }

  private push404(): undefined {
    this.router.navigate(['/404']).then(r => console.log(r))
    return undefined
  }

  private get authenticated(): boolean {
    return !!this.authenticationService.currentUserValue
  }
}
