import { formatDate } from '@angular/common'

export class Activity {
  id: string
  ownerUsername: string
  name: string
  description: string
  timeStart: Date
  timeEnd: Date
  date: Date
  statusActive: boolean
  repeatWeekly: boolean
  selfLink: string

  constructor(id: string, ownerUsername: string, name: string, description: string, timeStart: Date,
              timeEnd: Date, date: Date, statusActive: boolean, repeatWeekly: boolean, selfLink: string) {

    this.id = id
    this.ownerUsername = ownerUsername
    this.name = name
    this.description = description
    this.timeStart = timeStart
    this.timeEnd = timeEnd
    this.date = date
    this.statusActive = statusActive
    this.repeatWeekly = repeatWeekly
    this.selfLink = selfLink
  }

  get toString(): string {
    return this.name + ' (' + this.date.toDateString() + ') (' +
      this.timeStart.toLocaleTimeString() + ' - ' + this.timeEnd.toLocaleTimeString() + ')'
  }

  get weekDayName(): string {
    return formatDate(this.date, 'EEEE', 'en-US')
  }

  get crispyTime(): string {
    let time: string
    time = formatDate(this.timeStart, 'HH:mm', 'en-US')
    time += ' - '
    time += formatDate(this.timeEnd, 'HH:mm', 'en-US')
    return time
  }
}
