export class Task {
  id: string;
  name: string;
  selfLink: string;

  constructor(id: string, name: string, selfLink: string) {
    this.id = id;
    this.name = name;
    this.selfLink = selfLink;
  }
}
