import { Component, OnInit } from '@angular/core'
import { ActivityService, TaskService } from '@app/_services'
import { Quest } from '@app/week/_models'
import { Activity, Task } from '@app/_models'
import { formatDate } from '@angular/common'
import { SchedulerWeekDay } from '@app/week/_helpers';

@Component({
  selector: 'app-week-schedule',
  templateUrl: './week-schedule.component.html',
  styleUrls: ['./week-schedule.component.css']
})
export class WeekScheduleComponent implements OnInit {
  loading = true
  weekDays: SchedulerWeekDay[]
  private currentDate: Date
  currentDateFormat: string

  private taskList: Task[]
  private activitiesList: Activity[]
  private weekShift: number

  loadingTasks = true
  loadingActivities = true

  constructor(
    private taskService: TaskService,
    private activityService: ActivityService,
) { }

  ngOnInit(): void {
    // Get Tasks and Activities data from server.

    // Get Tasks.
    this.getTasks().then(r => console.log(r))

    // Get Activities.
    this.getActivities().then(r => console.log(r))

    // (async () => {
    //   await this.getTasks()
    //   await this.getActivities()
    //   this.onCurrentWeek()
    // })();

    // this.onCurrentWeek()
  }

  setQuestsForChosenWeek() {
    this.loading = true

    // Get date of Monday in chosen week.
    let mondayDate = new Date(this.currentDate)
    mondayDate.setDate(this.currentDate.getDate() - this.currentDate.getDay() + 1)
    console.log('Current date', this.currentDate)
    console.log('Monday date day', mondayDate.getDay())
    console.log('Monday date', mondayDate)

    // Create list of days which occurs in a week in which selected day is present.
    this.weekDays = []
    for (let i = 0; i < 7; i++) {
      let weekDayDate = new Date(mondayDate)
      weekDayDate.setDate(mondayDate.getDate() + i)
      console.log(weekDayDate.toDateString())
      console.log(weekDayDate.getDay())
      this.weekDays.push(new SchedulerWeekDay(weekDayDate, []))
    }

    let gotAtLeastOneQuest = false

    for (let activity of this.activitiesList) {
      // Skip adding inactive activities.
      if (!activity.statusActive) {
        continue
      }

      for (let weekDay of this.weekDays) {
        console.log(activity.date.toDateString())
        console.log(weekDay.date.toDateString())
        if (activity.date.toDateString() === weekDay.date.toDateString() || (activity.repeatWeekly && activity.weekDayName === weekDay.weekDayName)) {
          weekDay.quests.push(new Quest(activity.id, activity.name, activity.description, activity.crispyTime, null))
          gotAtLeastOneQuest = true
          console.log('Added Activity!', activity)
          break
        }
      }
    }

    for (let task of this.taskList) {
      // Skip adding done tasks.
      if (task.done) {
        continue
      }

      for (let weekDay of this.weekDays) {
        if (task.dueDateTime.toDateString() === weekDay.date.toDateString()) {
          let newQuest = new Quest(task.id, task.name, task.description, task.crispyTime, task.priority)
          let newQuestDate = new Date('01/01/1900 ' + newQuest.time + ':00')
          let newQuestTime = newQuestDate.getTime()
          console.log('New Quest time', newQuestTime)

          // Add task in a proper order to the week day.
          let i = 0
          let addedTask = false
          for (let quest of weekDay.quests) {
            const questDate = new Date('01/01/1900 ' + quest.time.substr(0,5) + ':00')
            let questTime = questDate.getTime()
            console.log('Quest time', questTime)
            if (newQuestTime < questTime) {
              weekDay.quests.splice(i, 0, newQuest)
              gotAtLeastOneQuest = true
              console.log('Added Task in loop!', task)
              addedTask = true
              break
            }
            i++
          }
          if (!addedTask) {
            weekDay.quests.push(newQuest)
            gotAtLeastOneQuest = true
            console.log('Added Task end loop!', task)
          }
        }
      }
    }

    // If there are no Quests in current week, don't display anything.
    if (!gotAtLeastOneQuest) {
      this.weekDays = null
    }

    this.loading = false
  }

  private async getTasks() {
    const resultTasks = this.taskService.getAll()
    if (resultTasks) {
      await resultTasks.subscribe(tasks => {
        // Check if there are tasks to save.
        if (tasks) {
          this.taskList = tasks
        }
      })
      this.loadingTasks = false
    }
  }

  private async getActivities() {
    const resultActivities = this.activityService.getAll()
    if (resultActivities) {
      await resultActivities.subscribe(activities => {
        // Check if there are activities to save.
        if (activities) {
          this.activitiesList = activities
        }
      })
      this.loadingActivities = false
    }
  }

  onCurrentWeek(): void {
    this.weekShift = 0
    this.setCurrentDate()
    this.setQuestsForChosenWeek()
  }

  onNextWeek(): void {
    this.weekShift++
    this.setCurrentDate()
    this.setQuestsForChosenWeek()
  }

  onPreviousWeek(): void {
    this.weekShift--
    this.setCurrentDate()
    this.setQuestsForChosenWeek()
  }

  setCurrentDate(): void {
    let date = new Date()
    date.setDate(date.getDate() + 7 * this.weekShift)
    this.currentDate = date
    this.currentDateFormat = formatDate(date, 'yyyy-MM-dd', 'en-US', Intl.DateTimeFormat().resolvedOptions().timeZone)
  }

  delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

}
