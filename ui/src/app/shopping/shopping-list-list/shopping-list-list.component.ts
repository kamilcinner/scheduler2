import { Component, OnInit } from '@angular/core';
import { ShoppingList } from '@app/shopping/_models';
import { ShoppingService } from '@app/shopping/_services/shopping.service';

@Component({
  selector: 'app-shopping-list-list',
  templateUrl: './shopping-list-list.component.html',
  styleUrls: ['./shopping-list-list.component.css']
})
export class ShoppingListListComponent implements OnInit {
  loading = true
  shoppingLists: ShoppingList[]

  constructor(
    private shoppingService: ShoppingService
  ) { }


  ngOnInit(): void {
    // Get ShoppingList data from server.
    (async () => {
      // Get shopping lists.
      await this.getShoppingLists()

      // Get items for each shopping list.
      for (const shoppingList of this.shoppingLists) {
        await this.getItems(shoppingList.id)
      }

      this.loading = false
    })()
  }

  private getShoppingLists() {
    console.log('getting shopping lists')
    return new Promise(resolve => {
      const result = this.shoppingService.getAllShoppingLists()
      if (result) {
        result.subscribe(shoppingLists => {
          // Check if there are shopping lists to display.
          if (shoppingLists) {
            this.shoppingLists = shoppingLists
          }
          resolve()
        })
      }
    })
  }

  private getItems(id: string) {
    console.log('getting items for ' + id)
    return new Promise(resolve => {
      const result = this.shoppingService.getAllItems(id)
      if (result) {
        result.subscribe(items => {
          // Check if there are items to display.
          if (items) {
            // Loop to find shopping list by id and add items to it.
            for (const i in this.shoppingLists) {
              if (this.shoppingLists[i].id === id) {
                this.shoppingLists[i].items = items
                break
              }
            }
          }
          resolve()
        })
      }
    })
  }
}
