import { ShoppingListItem } from '@app/shopping/_models';

export class ShoppingList {
  id: string
  ownerUsername: string
  lastEditDateTime: Date
  shared: boolean

  items: ShoppingListItem[]

  constructor(id: string, ownerUsername: string, lastEditDateTime: Date, shared: boolean, items: ShoppingListItem[]) {
    this.id = id
    this.ownerUsername = ownerUsername
    this.lastEditDateTime = lastEditDateTime
    this.shared = shared
    this.items = items
  }
}
