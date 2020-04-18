export class Task {
  id: string;
  name: string;
  dueDateTime: Date;
  description: string;
  priority: string;
  done: boolean;
  shared: boolean;
  selfLink: string;

  constructor(id: string, name: string, dueDateTime: Date, description: string, priority: string,
              done: boolean, shared: boolean, selfLink: string) {
    this.id = id;
    this.name = name;
    this.dueDateTime = dueDateTime;
    this.description = description;
    this.priority = priority;
    this.done = done;
    this.shared = shared;
    this.selfLink = selfLink;
  }

  get isOverdue() {
    return (this.dueDateTime.getTime() < Date.now()) && !this.done;
  }

  get priorityName() {
    switch (this.priority) {
      case 'h': return 'High';
      case 'l': return 'Low';
      default: return 'Normal';
    }
  }

  isOneOfPriorities(prior1: string, prior2: string) {
    if (this.priority === prior1 || this.priority === prior2) {
      return true;
    }
    return false;
  }
}
