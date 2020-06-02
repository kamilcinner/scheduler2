import { Component, OnInit } from '@angular/core'
import { ShoppingList } from '@app/shopping/_models'
import { ShoppingService } from '@app/shopping/_services/shopping.service'
import { Router } from '@angular/router';
import { PageNotFound } from '@app/_helpers';

@Component({
  selector: 'app-shopping-list-list',
  templateUrl: './shopping-list-list.component.html',
  styleUrls: ['./shopping-list-list.component.css']
})
export class ShoppingListListComponent implements OnInit {
  loading = true
  shoppingLists: ShoppingList[]

  constructor(
    private shoppingService: ShoppingService,
    private router: Router
  ) { }


  ngOnInit(): void {
    // Get Shopping lists data from server.
    // Synchronize.
    (async () => {
      // Get Shopping lists.
      await this.getShoppingLists()

      // Add Items to each Shopping list.
      if (this.shoppingLists) {
        for (const shoppingList of this.shoppingLists) {
          await this.addItems(shoppingList.id)
        }
      }

      this.loading = false
    })()
  }

  private getShoppingLists() {
    console.log('Getting Shopping lists...')
    return new Promise(resolve => {
      this.shoppingService.getAllShoppingLists().subscribe(shoppingLists => {
        // Check if there are shopping lists to display.
        if (shoppingLists) {
          this.shoppingLists = shoppingLists
        }
        resolve()
      })
    })
  }

  private addItems(id: string) {
    console.log(`Getting Items from Shopping list ${id}.`)
    return new Promise(resolve => {
      const result = this.shoppingService.getAllItems(id)
      if (result) {
        result.subscribe(items => {
          // Check if there are items to add.
          if (items) {
            // Loop to find Shopping list by id and add Items to it.
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
      else {
        // If id is invalid UUID.
        PageNotFound.redirect(this.router)
        resolve()
      }
    })
  }
}
