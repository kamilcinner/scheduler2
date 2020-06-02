import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core'
import { Activity } from '@app/activity/_models'

@Component({
  selector: 'app-activity-confirm-delete',
  templateUrl: './activity-confirm-delete.component.html',
  styleUrls: ['./activity-confirm-delete.component.css']
})
export class ActivityConfirmDeleteComponent implements OnInit {

  @Input() activity: Activity

  @Output() confirmDelete = new EventEmitter()
  @Output() abortDelete = new EventEmitter()

  constructor() { }

  ngOnInit(): void {
  }

}
