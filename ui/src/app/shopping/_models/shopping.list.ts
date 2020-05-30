import { ShoppingListItem } from '@app/shopping/_models';

export class ShoppingList {
  id: string
  ownerUsername: string
  name: string
  lastEditDateTime: Date
  shared: boolean

  items: ShoppingListItem[]

  constructor(id: string, ownerUsername: string, name: string, lastEditDateTime: Date, shared: boolean, items: ShoppingListItem[]) {
    this.id = id
    this.ownerUsername = ownerUsername
    this.name = name
    this.lastEditDateTime = lastEditDateTime
    this.shared = shared
    this.items = items
  }

  negateShare(): void {
    this.shared = !this.shared
  }

  get isDone(): boolean {
    return !(this.items.length > 0 && this.items[0].done === false);
  }

  get toString(): string {
    return this.name + ' (' + this.lastEditDateTime.toDateString() + ')'
  }
}
