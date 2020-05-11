import { Quest } from '@app/week/_models';

export const WEEK_DAYS: [string, number][] = [
    ['Monday',       0],
    ['Tuesday',      1],
    ['Wednesday',    2],
    ['Thursday',     3],
    ['Friday',       4],
    ['Saturday',     5],
    ['Sunday',       6]
]

export class SchedulerWeekDay {
  date: Date
  quests: Quest[]

  constructor(date: Date, quests: Quest[]) {
    this.date = date
    this.quests = quests
  }

  get weekDayName(): string {
    return WEEK_DAYS[this.date.getDay()][0];
  }
}
