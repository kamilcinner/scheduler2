export class Task {
  id: string;
  name: string;
  dueDateTime: Date;
  description: string;
  priority: string;
  status: boolean;
  shared: boolean;
  selfLink: string;

  constructor(id: string, name: string, dueDateTime: Date, description: string, priority: string,
              status: boolean, shared: boolean, selfLink: string) {
    this.id = id;
    this.name = name;
    this.dueDateTime = dueDateTime;
    this.description = description;
    this.priority = priority;
    this.status = status;
    this.shared = shared;
    this.selfLink = selfLink;
  }

  get isOverdue() {
    return (this.dueDateTime.getTime() < Date.now()) && this.status;
  }
}
