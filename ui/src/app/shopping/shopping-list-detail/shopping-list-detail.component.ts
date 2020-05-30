import { Component, OnInit } from '@angular/core';
import { ShoppingList } from '@app/shopping/_models';
import { ShoppingService } from '@app/shopping/_services/shopping.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticationService } from '@app/_services';

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
    private shoppingService: ShoppingService,
    private route: ActivatedRoute,
    private router: Router,
    private authenticationService: AuthenticationService
  ) { }

  ngOnInit(): void {
    // Get Shopping list id from URL.
    let id;
    this.route.paramMap.subscribe(params => {
      id = params.get('id')
    });

    (async () => {
      // Get Shopping list.
      await this.getShoppingList(id)

      // Get items for Shopping list.
      await this.getItems(this.shoppingList.id)

      this.loadingDetail = false
    })()
  }

  private getShoppingList(id: string) {
    console.log('Getting shopping list')
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
            // Add items to Shopping list.
            this.shoppingList.items = items
          }
          resolve()
        })
      } else { resolve() }
    })
  }

  // Change Shopping list shared status to opposite.
  onShare(): void {
    this.loadingShareBtn = true
    const result = this.shoppingService.share(this.shoppingList.id)
    if (result) {
      result.subscribe(
        _ => {
          this.shoppingList.negateShare()
          this.loadingShareBtn = false
        }
      )
    }
  }

  // Delete Shopping list.
  onDelete(): void {
    const result = this.shoppingService.deleteShoppingList(this.shoppingList.id);
    if (result) {
      result.subscribe(
        _ => this.router.navigate(['/shoppinglists'])
      );
    }
  }

  // Mark item done/undone.
  onMark(id: string): void {
    const result = this.shoppingService.markItem(id)
    if (result) {
      result.subscribe(_ => this.markLocalItem(id))
    }
  }

  private markLocalItem(id: string): void {
    for (const i in this.shoppingList.items) {
      if (this.shoppingList.items[i].id === id) {
        this.shoppingList.items[i].done = !this.shoppingList.items[i].done
        return
      }
    }
  }

  onShowDeleteConfirmation(): void {
    this.hideDelete = false;
  }

  onHideDeleteConfirmation(): void {
    this.hideDelete = true;
  }

  get authenticated(): boolean {
    return !!this.authenticationService.currentUserValue;
  }

  get currentUserIsOwner(): boolean {
    if (!this.authenticated) {
      return false;
    }
    if (this.shoppingList.ownerUsername !== this.authenticationService.currentUserValue.username) {
      return false;
    }
    return true;
  }
}
