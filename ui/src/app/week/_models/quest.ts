export class Quest {
  id: string;
  name: string;
  description: string;
  time: string;
  priority: string;

  constructor(id: string, name: string, description: string, time: string, priority: string) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.time = time;
    this.priority = priority;
  }
}
