import { Component, OnInit } from '@angular/core';
import { Activity } from '@app/_models';
import { ActivityService } from '@app/_services';

@Component({
  selector: 'app-activity-list',
  templateUrl: './activity-list.component.html',
  styleUrls: ['./activity-list.component.css']
})
export class ActivityListComponent implements OnInit {
  loading = true;
  activities: Activity[];

  constructor(
    private activityService: ActivityService
  ) { }

  ngOnInit(): void {
    // Get Activities data from server.
    const result = this.activityService.getAll();
    if (result) {
      result.subscribe(activities => {
        // Check if there are activities to display.
        if (activities) {
          this.activities = activities;
        }
        this.loading = false;
      })
    }
  }

}
