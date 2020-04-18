import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { TaskService } from '@app/_services';
import { ActivatedRoute, Router } from '@angular/router';
import { Task } from '@app/_models';
import { formatDate } from '@angular/common';

@Component({
  selector: 'app-task-form',
  templateUrl: './task-form.component.html',
  styleUrls: ['./task-form.component.css']
})
export class TaskFormComponent implements OnInit {
  task: Task;
  taskForm: FormGroup = null;
  loading = false;
  loadingForm = false;
  errors;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private taskService: TaskService,
  ) { }

  ngOnInit(): void {
    let id;
    this.route.paramMap.subscribe(params => {
      id = params.get('id');
    });

    if (id) {
      this.loadingForm = true;

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
            console.warn('Task to edit', this.task);

            // Build form with edited Task data.
            this.buildTaskForm(task.name,
              formatDate(task.dueDateTime, 'yyyy-MM-dd', 'en-US'),
              formatDate(task.dueDateTime, 'HH:mm', 'en-US'),
              task.description, task.priority);
          }

          this.loadingForm = false;
        });
      }
    }

    // Build default form.
    this.buildTaskForm('', formatDate(new Date(), 'yyyy-MM-dd', 'en-US'),
        formatDate(new Date(), 'HH:mm', 'en-US'), '', 'n');
  }

  // Convenience getter for easy access to form fields.
  get f() { return this.taskForm.controls; }

  onSubmit(): void {
    this.loading = true;

    // Stop here if form is invalid.
    if (this.taskForm.invalid) {
      return;
    }

    // Get id from edited task if there is one.
    // Otherwise the id will be null and TaskService will send post request to create new Task.
    let id;
    if (this.task) {
      id = this.task.id;
    }

    const result = this.taskService.update(
      id,
      this.f.name.value,
      new Date(this.f.dueDate.value + ' ' + this.f.dueTime.value),
      this.f.description.value,
      this.f.priority.value
    );
    if (result) {
      result.subscribe(
        task => {
          if (task) {
            this.router.navigate(['/tasks/one', task.id]).then(r => console.log(r));
          } else {
            alert('Something went wrong.');
          }
        },
        errors => {
          this.errors = errors;
          this.loading = false;
        }
      );
    }
  }

  private buildTaskForm(name: string, dueDateFormat: string, dueTimeFormat: string, description: string,
                        priority: string): void {
    this.taskForm = this.formBuilder.group({
      name,
      dueDate: dueDateFormat,
      dueTime: dueTimeFormat,
      description,
      priority
    });
  }

}
