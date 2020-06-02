import { Component, OnInit } from '@angular/core'
import { Activity } from '@app/activity/_models'
import { FormBuilder, FormGroup } from '@angular/forms'
import { ActivatedRoute, Router } from '@angular/router'
import { ActivityService } from '@app/activity/_services'
import { formatDate } from '@angular/common'
import { PageNotFound } from '@app/_helpers';

@Component({
  selector: 'app-activity-form',
  templateUrl: './activity-form.component.html',
  styleUrls: ['./activity-form.component.css']
})
export class ActivityFormComponent implements OnInit {
  activity: Activity
  activityForm: FormGroup = null
  loading = false
  loadingForm = false
  errors

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private activityService: ActivityService,
  ) { }

  ngOnInit(): void {
    // Get id from url if there is one.
    let id
    this.route.paramMap.subscribe(params => {
      id = params.get('id')
    })

    // If id is specified then get Activity data from API.
    if (id) {
      this.loadingForm = true

      // Get Activity data from server.
      const result = this.activityService.getOne(id)
      if (result) {
        result.subscribe(activity => {
          // Check if there is an Activity.
          if (activity) {
            // Save activity to component object.
            this.activity = activity

            // Build form with edited activity data.
            this.buildActivityForm(activity.name, activity.description,
              formatDate(activity.timeStart, 'HH:mm', 'en-US'),
              formatDate(activity.timeEnd, 'HH:mm', 'en-US'),
              formatDate(activity.date, 'yyyy-MM-dd', 'en-US'),
              activity.statusActive, activity.repeatWeekly)
          }
          // If API can't return proper Activity for some reason and doesn't throw any error by itself.
          else {
            PageNotFound.redirect(this.router)
          }

          this.loadingForm = false
        })
      }
      // If id is an invalid UUID.
      else {
        PageNotFound.redirect(this.router)
      }
    }

    // Build default form.
    this.buildActivityForm('', '',
      formatDate(new Date(), 'HH:mm', 'en-US'),
      formatDate(new Date(), 'HH:mm', 'en-US'),
      formatDate(new Date(), 'yyyy-MM-dd', 'en-US'),
      true, false, )
  }

  // Convenience getter for easy access to form fields.
  get f() { return this.activityForm.controls }

  onSubmit(): void {
    this.loading = true

    // Stop here if form is invalid.
    if (this.activityForm.invalid) {
      this.loading = false
      return
    }

    // Get id from edited activity if there is one.
    // Otherwise the id will be null and ActivityService will send post request to create new Activity.
    let id
    if (this.activity) {
      id = this.activity.id
    }

    // Send request to API with proper data.
    const result = this.activityService.update(
      id,
      this.f.name.value,
      this.f.description.value,
      formatDate(new Date('01/01/1900 '+this.f.timeStart.value), 'HH:mm:ss', 'en-US'),
      formatDate(new Date('01/01/1900 '+this.f.timeEnd.value), 'HH:mm:ss', 'en-US'),
      new Date(this.f.date.value),
      this.f.statusActive.value,
      this.f.repeatWeekly.value
    )

    if (result) {
      result.subscribe(
        activity => {
          if (activity) {
            this.router.navigate(['/activities/one', activity.id]).then(r => console.log(r))
          } else {
            alert('Something went wrong :( Please, try again :)')
            this.loading = false
          }
        },
        errors => {
          this.errors = errors
          this.loading = false
        }
      )
    }
    // If id is an invalid UUID.
    else {
      PageNotFound.redirect(this.router)
    }
  }

  private buildActivityForm(name: string, description: string, timeStartFormat: string, timeEndFormat: string,
                            dateFormat: string, statusActive: boolean, repeatWeekly: boolean) {

    this.activityForm = this.formBuilder.group({
      name,
      description,
      timeStart: timeStartFormat,
      timeEnd: timeEndFormat,
      date: dateFormat,
      statusActive,
      repeatWeekly
    })
  }

}
