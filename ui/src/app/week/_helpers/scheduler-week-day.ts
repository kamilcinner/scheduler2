import { Quest } from '@app/week/_models'
import { formatDate } from '@angular/common'

export class SchedulerWeekDay {
  date: Date
  quests: Quest[]

  constructor(date: Date, quests: Quest[]) {
    this.date = date
    this.quests = quests
  }

  get weekDayName(): string {
    return formatDate(this.date, 'EEEE', 'en-US')
  }
}
