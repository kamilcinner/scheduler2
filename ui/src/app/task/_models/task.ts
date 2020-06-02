import { formatDate } from '@angular/common'

export class Task {
  id: string
  ownerUsername: string
  name: string
  dueDateTime: Date
  description: string
  priority: string
  done: boolean
  shared: boolean
  selfLink: string

  constructor(id: string, ownerUsername: string, name: string, dueDateTime: Date, description: string,
              priority: string, done: boolean, shared: boolean, selfLink: string) {

    this.id = id
    this.ownerUsername = ownerUsername
    this.name = name
    this.dueDateTime = dueDateTime
    this.description = description
    this.priority = priority
    this.done = done
    this.shared = shared
    this.selfLink = selfLink
  }

  get isOverdue(): boolean {
    return (this.dueDateTime.getTime() < Date.now()) && !this.done
  }

  get priorityName(): string {
    switch (this.priority) {
      case 'h': return 'High'
      case 'l': return 'Low'
      default: return 'Normal'
    }
  }

  get crispyTime(): string {
    return formatDate(this.dueDateTime, 'HH:mm', 'en-US')
  }

  isOneOfPriorities(prior1: string, prior2: string): boolean {
    return this.priority === prior1 || this.priority === prior2;
  }

  negateDone(): void {
    this.done = !this.done
  }

  negateShare(): void {
    this.shared = !this.shared
  }

  get toString(): string {
    return this.name + ' (' + this.dueDateTime.toDateString() + ')'
  }
}
