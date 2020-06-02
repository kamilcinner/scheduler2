import { Component, OnInit } from '@angular/core'
import { Activity } from '@app/activity/_models'
import { ActivityService } from '@app/activity/_services'

@Component({
  selector: 'app-activity-list',
  templateUrl: './activity-list.component.html',
  styleUrls: ['./activity-list.component.css']
})
export class ActivityListComponent implements OnInit {
  loading = true
  activities: Activity[]

  constructor(
    private activityService: ActivityService
  ) { }

  ngOnInit(): void {
    // Get Activities data from server.
    this.activityService.getAll().subscribe(activities => {
      // Check if there are activities to display.
      if (activities) {
        this.activities = activities
      }
      this.loading = false
    })
  }

}
