export class Quest {
  id: string
  name: string
  description: string
  time: string
  priority: string

  constructor(id: string, name: string, description: string, time: string, priority: string) {
    this.id = id
    this.name = name
    this.description = description
    this.time = time
    this.priority = priority
  }

  get absoluteUrl(): string {
    let url: string
    if (this.priority) {
      url = '/tasks'
    } else {
      url = '/activities'
    }
    url += `/one/${this.id}`
    return url
  }

  isOneOfPriorities(prior1: string, prior2: string): boolean {
    return this.priority === prior1 || this.priority === prior2;
  }

  get priorityName(): string {
    switch (this.priority) {
      case 'h': return 'High'
      case 'l': return 'Low'
      default: return 'Normal'
    }
  }
}
