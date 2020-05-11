import { Component, OnInit } from '@angular/core'
import { ActivityService, TaskService } from '@app/_services'
import { Quest } from '@app/week/_models'
import { Activity, Task } from '@app/_models'
import { formatDate, Time } from '@angular/common'
import { SchedulerWeekDay } from '@app/week/_helpers';

@Component({
  selector: 'app-week-schedule',
  templateUrl: './week-schedule.component.html',
  styleUrls: ['./week-schedule.component.css']
})
export class WeekScheduleComponent implements OnInit {
  loading = true
  weekDays: SchedulerWeekDay[]
  currentDateFormat: string

  constructor(
    private taskService: TaskService,
    private activityService: ActivityService,
    private taskList: Task[],
    private activitiesList: Activity[],
    private quests: Quest[],
    private weekShift: number,
) {
    this.onCurrentWeek()
  }

  ngOnInit(): void {
    // Get Tasks and Activities data from server.

    // Get Tasks.
    this.getTasks().then(r => console.log(r))

    // Get Activities.
    this.getActivities().then(r => console.log(r))

    this.loading = false
  }

  setQuestsForChosenWeek() {
    this.loading = true

    // Get date of Monday.
    let currentDate = new Date(this.currentDateFormat)
    let mondayDate = new Date(currentDate.getDate() - currentDate.getDay())

    // Create list of days which occurs in a week in which selected day is present.
    this.weekDays = []
    for (let i = 0; i < 7; i++) {
      this.weekDays.push(new SchedulerWeekDay(new Date(mondayDate.getDate() + i), []))
    }

    let gotAtLeastOneQuest = false

    for (let activity of this.activitiesList) {
      // Skip adding inactive activities.
      if (!activity.statusActive) {
        continue
      }

      for (let weekDay of this.weekDays) {
        if (activity.date === weekDay.date || (activity.repeatWeekly && activity.weekDayName === weekDay.weekDayName)) {
          weekDay.quests.push(new Quest(activity.id, activity.name, activity.description, activity.crispyTime, null))
          gotAtLeastOneQuest = true
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
        // TODO: check if this if statement not compare time also
        if (task.dueDateTime.getDate() === weekDay.date.getDate()) {
          let newQuest = new Quest(task.id, task.name, task.description, task.crispyTime, task.priority)
          let newQuestTime: Time = { hours: task.dueDateTime.getHours(), minutes: task.dueDateTime.getMinutes() }
          // Add task in a proper order to the week day.
          let i = 0
          for (let quest of weekDay.quests) {
            const questDate = new Date('01/01/1900 ' + quest.time + ':00')
            let questTime: Time = { hours: questDate.getHours(), minutes: questDate.getMinutes() }
            if (newQuestTime < questTime) {
              weekDay.quests.splice(i, 0, newQuest)
              gotAtLeastOneQuest = true
              break
            }
            i++
          }
          if (i == 0) {
            weekDay.quests.push(newQuest)
            gotAtLeastOneQuest = true
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
    this.currentDateFormat = formatDate(date, 'yyyy-MM-dd', 'en-US')
  }

}
