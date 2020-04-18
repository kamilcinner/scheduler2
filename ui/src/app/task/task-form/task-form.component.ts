import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { TaskService } from '@app/_services';
import { Router } from '@angular/router';
import { Task } from '@app/_models';
import { formatDate } from '@angular/common';

@Component({
  selector: 'app-task-form',
  templateUrl: './task-form.component.html',
  styleUrls: ['./task-form.component.css']
})
export class TaskFormComponent implements OnInit {
  task: Task;
  taskForm: FormGroup;
  loading = false;
  errors;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private taskService: TaskService,
  ) { }

  ngOnInit(): void {
    this.taskForm = this.formBuilder.group({
      name: '',
      dueDate: formatDate(new Date(), 'yyyy-MM-dd', 'en-US'),
      dueTime: formatDate(new Date(), 'HH:mm', 'en-US'),
      description: '',
      priority: 'n',
      status: '',
      shared: false
    });
  }

  // Convenience getter for easy access to form fields.
  get f() { return this.taskForm.controls; }

  onSubmit() {
    this.loading = true;

    // Stop here if form is invalid.
    if (this.taskForm.invalid) {
      return;
    }

    this.taskService.new(
      this.f.name.value,
      new Date(this.f.dueDate.value + ' ' + this.f.dueTime.value),
      this.f.description.value,
      this.f.priority.value,
      this.f.shared.value
    ).subscribe(
      task => {
        if (task) {
          this.router.navigate(['/tasks', task.id]);
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

  private getCurrentDate() {
    const date = new Date();
    return date.toISOString().substring(0, 10);
  }

  private getCurrentTime() {
    const date = new Date();
    alert(date.getHours() + ':' + date.getMinutes());
    return date.getHours() + ':' + date.getMinutes();
    // return date.toISOString().substring(11, 15);
  }

}
