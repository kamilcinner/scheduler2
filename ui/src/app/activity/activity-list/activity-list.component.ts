import { Component, OnInit } from '@angular/core';
import { Activity } from '@app/_models';
import { ActivityService } from '@app/_services/activity.service';

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

  }

}
