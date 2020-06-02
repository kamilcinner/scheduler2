import { Component, OnInit } from '@angular/core'
import { Activity } from '@app/activity/_models'
import { FormBuilder, FormGroup } from '@angular/forms'
import { ActivatedRoute, Router } from '@angular/router'
import { ActivityService } from '@app/activity/_services'
import { formatDate } from '@angular/common'

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
    let id
    this.route.paramMap.subscribe(params => {
      id = params.get('id')
    })

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

            // Log.
            // TODO: delete this
            console.warn('Activity to edit', this.activity)

            // Build form with edited activity data.
            this.buildActivityForm(activity.name, activity.description,
              formatDate(activity.timeStart, 'HH:mm', 'en-US'),
              formatDate(activity.timeEnd, 'HH:mm', 'en-US'),
              formatDate(activity.date, 'yyyy-MM-dd', 'en-US'),
              activity.statusActive, activity.repeatWeekly)
          }

          this.loadingForm = false
        })
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

    // Get time start parameter.
    // const timeStartAsDate = new Date(this.f.timeStart.value)
    // let timeStart =

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
            alert('Something went wrong.')
          }
        },
        errors => {
          this.errors = errors
          this.loading = false
        }
      )
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
