import { Component, OnInit } from '@angular/core'
import { Activity } from '@app/activity/_models'
import { ActivatedRoute, Router } from '@angular/router'
import { ActivityService } from '@app/activity/_services'

@Component({
  selector: 'app-activity-detail',
  templateUrl: './activity-detail.component.html',
  styleUrls: ['./activity-detail.component.css']
})
export class ActivityDetailComponent implements OnInit {
  activity: Activity
  loadingDetail = true
  hideDelete = true

  constructor(
    private route: ActivatedRoute,
    private activityService: ActivityService,
    private router: Router
  ) { }

  ngOnInit(): void {
    // Get Activity id from URL.
    let id
    this.route.paramMap.subscribe(params => {
      id = params.get('id')
    })

    // Get Activity data from server.
    const result = this.activityService.getOne(id)
    if (result) {
      result.subscribe(activity => {
        // Check if there is an Activity.
        if (activity) {
          // Save Activity in component object.
          this.activity = activity

          // Log.
          // TODO: delete this
          console.warn('New Activity', this.activity)
        }
        this.loadingDetail = false
      })
    }
  }

  // Delete Activity.
  onDelete(): void {
    const result = this.activityService.delete(this.activity.id)
    if (result) {
      result.subscribe(
        _ => this.router.navigate(['/activities'])
      )
    }
  }

  onShowDeleteConfirmation(): void {
    this.hideDelete = false
  }

  onHideDeleteConfirmation(): void {
    this.hideDelete = true
  }

}
