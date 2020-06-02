import { Component, OnInit } from '@angular/core'
import { Activity } from '@app/activity/_models'
import { ActivatedRoute, Router } from '@angular/router'
import { ActivityService } from '@app/activity/_services'
import { PageNotFound } from '@app/_helpers';

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
    let id = ''
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
        }
        // If API can't return a proper Activity object and doesn't throw error.
        else {
          PageNotFound.redirect(this.router)
        }

        this.loadingDetail = false
      })
    }
    // If id is an invalid UUID.
    else {
      PageNotFound.redirect(this.router)
    }
  }

  // Delete Activity.
  onDelete(): void {
    const result = this.activityService.delete(this.activity.id)
    if (result) {
      result.subscribe(
        () => this.router.navigate(['/activities']).then(
          () => console.log(`Deleted Activity ${this.activity.id}.`)
        )
      )
    }
    // If id is an invalid UUID.
    else {
      PageNotFound.redirect(this.router)
    }
  }

  onShowDeleteConfirmation(): void {
    this.hideDelete = false
  }

  onHideDeleteConfirmation(): void {
    this.hideDelete = true
  }
}
