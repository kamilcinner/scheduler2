import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core'
import { Task } from '@app/task/_models'

@Component({
  selector: 'app-task-confirm-delete',
  templateUrl: './task-confirm-delete.component.html',
  styleUrls: ['./task-confirm-delete.component.css']
})
export class TaskConfirmDeleteComponent implements OnInit {

  @Input() task: Task

  @Output() confirmDelete = new EventEmitter()
  @Output() abortDelete = new EventEmitter()

  constructor() { }

  ngOnInit(): void {
  }

}
