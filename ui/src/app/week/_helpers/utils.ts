import { Quest } from '@app/week/_models';
import { formatDate } from '@angular/common';

// export const WEEK_DAYS: [string, number][] = [
//     ['Sunday',       0],
//     ['Monday',       1],
//     ['Tuesday',      2],
//     ['Wednesday',    3],
//     ['Thursday',     4],
//     ['Friday',       5],
//     ['Saturday',     6]
// ]

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
