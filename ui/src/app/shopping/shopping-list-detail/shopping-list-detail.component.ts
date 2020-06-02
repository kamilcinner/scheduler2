import { Component, OnInit } from '@angular/core'
import { ShoppingList } from '@app/shopping/_models'
import { ShoppingService } from '@app/shopping/_services/shopping.service'
import { ActivatedRoute, Router } from '@angular/router'
import { AuthenticationService } from '@app/_services'
import { PageNotFound } from '@app/_helpers';

@Component({
  selector: 'app-shopping-list-detail',
  templateUrl: './shopping-list-detail.component.html',
  styleUrls: ['./shopping-list-detail.component.css']
})
export class ShoppingListDetailComponent implements OnInit {
  shoppingList: ShoppingList
  loadingShareBtn = false
  loadingDetail = true
  hideDelete = true

  constructor(
    protected shoppingService: ShoppingService,
    protected route: ActivatedRoute,
    protected router: Router,
    protected authenticationService: AuthenticationService
  ) { }

  ngOnInit(): void {
    // Get Shopping list id from URL.
    let id
    this.route.paramMap.subscribe(params => {
      id = params.get('id')
    });

    // Get Shopping list data from server.
    // Synchronize.
    (async () => {
      // Get Shopping list.
      await this.getShoppingList(id)

      // Get Items for Shopping list.
      await this.getItems(this.shoppingList.id)

      this.loadingDetail = false
    })()
  }

  protected getShoppingList(id: string) {
    console.log(`Getting Shopping list ${id}.`)
    return new Promise(resolve => {
      const result = this.shoppingService.getOneShoppingList(id)
      if (result) {
        result.subscribe(shoppingList => {
          // Check if there is Shopping list to display.
          if (shoppingList) {
            this.shoppingList = shoppingList
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

  protected getItems(id: string) {
    console.log(`Getting Items from Shopping list ${id}.`)
    return new Promise(resolve => {
      const result = this.shoppingService.getAllItems(id)
      if (result) {
        result.subscribe(items => {
          // Check if there are items to add.
          if (items) {
            // Add Items to the parent Shopping list.
            this.shoppingList.items = items
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

  // Change Shopping list shared status to opposite.
  onShare(): void {
    this.loadingShareBtn = true
    const result = this.shoppingService.shareShoppingList(this.shoppingList.id)
    if (result) {
      result.subscribe(() => {
          this.shoppingList.negateShare()
          this.loadingShareBtn = false
          console.log(`Shared/Unshared Shopping list ${this.shoppingList.id}.`)
        }
      )
    }
    else {
      // If id is invalid UUID.
      PageNotFound.redirect(this.router)
    }
  }

  // Delete Shopping list.
  onDelete(): void {
    const result = this.shoppingService.deleteShoppingList(this.shoppingList.id)
    if (result) {
      result.subscribe(
        () => this.router.navigate(['/shoppinglists']).then(
          () => console.log(`Deleted Shopping list ${this.shoppingList.id}.`)
        )
      )
    }
    else {
      // If id is invalid UUID.
      PageNotFound.redirect(this.router)
    }
  }

  // Mark item done/undone.
  onMark(id: string): void {
    const result = this.shoppingService.markItem(id)
    if (result) {
      result.subscribe(() => this.markLocalItem(id))
    }
    else {
      // If id is invalid UUID.
      PageNotFound.redirect(this.router)
    }
  }

  private markLocalItem(id: string): void {
    for (const i in this.shoppingList.items) {
      if (this.shoppingList.items[i].id === id) {
        this.shoppingList.items[i].done = !this.shoppingList.items[i].done
        console.log(`Marked Item ${id}.`)
        return
      }
    }
  }

  onShowDeleteConfirmation(): void {
    this.hideDelete = false
  }

  onHideDeleteConfirmation(): void {
    this.hideDelete = true
  }

  get authenticated(): boolean {
    return this.authenticationService.authenticated
  }

  get currentUserIsOwner(): boolean {
    if (!this.authenticated) {
      return false
    }
    return this.shoppingList.ownerUsername === this.authenticationService.currentUserValue.username;
  }
}
