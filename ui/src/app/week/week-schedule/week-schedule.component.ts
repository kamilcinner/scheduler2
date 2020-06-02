import { Component, OnInit } from '@angular/core'
import { ActivityService } from '@app/activity/_services'
import { TaskService } from '@app/task/_services'
import { Quest } from '@app/week/_models'
import { Activity } from '@app/activity/_models'
import { Task } from '@app/task/_models'
import { formatDate } from '@angular/common'
import { SchedulerWeekDay } from '@app/week/_helpers'

@Component({
  selector: 'app-week-schedule',
  templateUrl: './week-schedule.component.html',
  styleUrls: ['./week-schedule.component.css']
})
export class WeekScheduleComponent implements OnInit {
  loading = true
  currentDateFormat: string
  weekDays: SchedulerWeekDay[]

  private taskList: Task[]
  private activitiesList: Activity[]

  constructor(
    private taskService: TaskService,
    private activityService: ActivityService,
) { }

  ngOnInit(): void {
    // Get Tasks and Activities data from server.

    (async () => {
      // Get Tasks.
      await this.getTasks()

      // Get Activities.
      await this.getActivities()

      // Show Quests for current week.
      this.loading = false
      this.onCurrentWeek()
    })()
  }

  setQuestsForChosenWeek() {
    this.loading = true

    // Get date of Monday in chosen week.
    let mondayDate = this.getChosenDate()
    // We treat Sunday as the end of the week. Not the start.
    // mondayOffset for Sunday is 0 and that's why we change it to 7.
    let mondayOffset = mondayDate.getDay()
    if (mondayOffset == 0) {
      mondayOffset = 7
    }
    mondayDate.setDate(mondayDate.getDate() - mondayOffset + 1)
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

    if (this.activitiesList) {
      for (let activity of this.activitiesList) {
        // Skip adding inactive activities.
        if (!activity.statusActive) {
          continue
        }

        for (let weekDay of this.weekDays) {
          console.log(activity.date.toDateString())
          console.log(weekDay.date.toDateString())
          if (activity.date.toDateString() === weekDay.date.toDateString() ||
              (activity.repeatWeekly && activity.weekDayName === weekDay.weekDayName)) {

            weekDay.quests.push(new Quest(activity.id, activity.name, activity.description,
              activity.crispyTime, null))

            gotAtLeastOneQuest = true
            console.log('Added Activity!', activity)
            break
          }
        }
      }
    }

    if (this.taskList) {
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
              const questDate = new Date('01/01/1900 ' + quest.time.substr(0, 5) + ':00')
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
    }

    // If there are no Quests in current week, don't display anything.
    if (!gotAtLeastOneQuest) {
      this.weekDays = null
    }

    this.loading = false
  }

  private getTasks() {
    console.log('Getting tasks...')
    return new Promise(resolve => {
      this.taskService.getAll().subscribe(tasks => {
        // Check if there are tasks to save.
        if (tasks) {
          this.taskList = tasks
        }
        resolve()
      })
    })
  }

  private getActivities() {
    console.log('Getting activities...')
    return new Promise(resolve => {
      this.activityService.getAll().subscribe(activities => {
        // Check if there are activities to save.
        if (activities) {
          this.activitiesList = activities
        }
        resolve()
      })
    })
  }

  onCurrentWeek(): void {
    this.setCurrentDateFormat()
    this.setQuestsForChosenWeek()
  }

  onNextWeek(): void {
    this.setDateFormat(1)
    this.setQuestsForChosenWeek()
  }

  onPreviousWeek(): void {
    this.setDateFormat(-1)
    this.setQuestsForChosenWeek()
  }

  setCurrentDateFormat(): void {
    this.currentDateFormat = formatDate(new Date(), 'yyyy-MM-dd', 'en-US',
      Intl.DateTimeFormat().resolvedOptions().timeZone)
  }

  setDateFormat(weekShift: number): void {
    let date = this.getChosenDate()
    date.setDate(date.getDate() + 7 * weekShift)
    this.currentDateFormat = formatDate(date, 'yyyy-MM-dd', 'en-US',
      Intl.DateTimeFormat().resolvedOptions().timeZone)
  }

  getChosenDate(): Date {
    let dateString = this.currentDateFormat + ' 13:00:00'
    console.log('Date string', dateString)
    return new Date(dateString)
  }

  setChosenDateFormat(dateEvent): void {
    console.log(dateEvent.target.value)
    this.currentDateFormat = dateEvent.target.value
  }
}
