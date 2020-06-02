import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'

import { environment } from '@environments/environment'
import { map } from 'rxjs/operators'
import { Task } from '@app/task/_models'
import { AuthenticationService } from '@app/_services/authentication.service'
import { ValidationService } from '@app/_services/validation.service'

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  constructor(
    private http: HttpClient,
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

  /**
   * Gets all Tasks from API.
   */
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
              return null
            }

            // Add Task to the Tasks array.
            newTasks.push(TaskService.newTaskFromApiJSON(task))
          }
          return newTasks
        } else { return null }
      })
    )
  }

  /**
   * Gets one Task by id from API.
   * @param id (UUID string) of demanded Task.
   */
  getOne(id: string) {
    if (ValidationService.checkUUID(id)) {
      const url: string = `${environment.apiUrl}/tasks/` +
        (this.authenticationService.authenticated ? '' : 'shared/') + `${id}`

      return this.http.get<any>(url)
        .pipe(map(task => {
          if (task) {
            // Check if every field send from API is in acceptable format.
            if (!TaskService.checkTaskTypes(task)) {
              return null
            }

            // Return proper Task object.
            return TaskService.newTaskFromApiJSON(task)
          } else { return null }
        }))
    }
    // If id is an invalid UUID.
    return null
  }

  /**
   * Creates or updates the Task.
   * @param id (UUID string) if not null update request will be sent; if null - a new Task request.
   * @param name of the Task.
   * @param dueDateTime of The Task.
   * @param description of the Task.
   * @param priority of the Task.
   * @return Observable or null if invalid id was specified.
   */
  update(id: string, name: string, dueDateTime: Date, description: string, priority: string) {
    // If id is specified we want to update an existing Task.
    if (id) {
      if (ValidationService.checkUUID(id)) {
        return this.http.put<any>(`${environment.apiUrl}/tasks/${id}`,
          { name, dueDateTime, description, priority })
      }
      // If id is an invalid UUID.
      return null
    }
    // If no id is specified we want to create a new Task.
    else {
      return this.http.post<any>(`${environment.apiUrl}/tasks`,
        { name, dueDateTime, description, priority })
    }
  }

  /**
   * Deletes Task.
   * @param id (UUID string) of Task to delete.
   * @return Observable or null if id is an invalid UUID.
   */
  delete(id: string) {
    if (ValidationService.checkUUID(id)) {
      return this.http.delete(`${environment.apiUrl}/tasks/${id}`)
    }
    return null
  }

  /**
   * Share/Unshare Task.
   * @param id (UUID string) of Task to update.
   * @return Observable or null if id is an invalid UUID.
   */
  share(id: string) {
    if (ValidationService.checkUUID(id)) {
      return this.http.get(`${environment.apiUrl}/tasks/${id}/share`)
    }
    return null
  }

  /**
   * Marks Task done/undone.
   * @param id (UUID string) of Task to update.
   * @return Observable or null if id is an invalid UUID.
   */
  mark(id: string) {
    if (ValidationService.checkUUID(id)) {
      return this.http.get(`${environment.apiUrl}/tasks/${id}/mark`)
    }
    return null
  }
}
