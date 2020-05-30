import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthenticationService } from '@app/_services';
import { ShoppingList, ShoppingListItem } from '@app/shopping/_models';
import { environment } from '@environments/environment';
import { map } from 'rxjs/operators';
import { ValidationService } from '@app/_services/validation.service';

@Injectable({
  providedIn: 'root'
})
export class ShoppingService {

  constructor(
    private http: HttpClient,
    private router: Router,
    private authenticationService: AuthenticationService
  ) { }

  // Checks if every ShoppingList field send from API is in acceptable format.
  private static checkShoppingListTypes(shoppingList): boolean {
    return !(typeof shoppingList.id !== 'string' || typeof shoppingList.ownerUsername !== 'string' ||
      typeof shoppingList.name !== 'string' || typeof shoppingList.lastEditDateTime !== 'string' ||
      typeof shoppingList.shared !== 'boolean')
  }

  // Checks if every ShoppingListItem field send from API is in acceptable format.
  private static checkShoppingListItemTypes(shoppingListItem): boolean {
    return !(typeof shoppingListItem.id !== 'string' || typeof shoppingListItem.name !== 'string' ||
      typeof shoppingListItem.done !== 'boolean')
  }

  // Returns proper ShoppingListItem object created from API JSON.
  private static newShoppingListItemFromApiJSON(shoppingListItem): ShoppingListItem {
    const newShoppingListItem = new ShoppingListItem(shoppingListItem.id, shoppingListItem.name, shoppingListItem.done)
    console.log('Saved ShoppingListItem', newShoppingListItem)
    return newShoppingListItem
  }

  // Returns proper ShoppingList object created from API JSON.
  private static newShoppingListFromApiJSON(shoppingList): ShoppingList {
    const newShoppingList = new ShoppingList(shoppingList.id, shoppingList.ownerUsername, shoppingList.name,
      new Date(shoppingList.lastEditDateTime), shoppingList.shared, [])
    console.log('Saved ShoppingList', newShoppingList)
    return newShoppingList
  }

  // Get all ShoppingLists.
  getAllShoppingLists() {
    return this.http.get<any>(`${environment.apiUrl}/shoppinglists`)
      .pipe(map(shoppingLists => {
        if (shoppingLists._embedded && shoppingLists._embedded.shoppingListList) {
          shoppingLists = shoppingLists._embedded.shoppingListList

          // Initialize ShoppingLists array.
          const newShoppingLists: ShoppingList[] = []

          // Loop over JSON shoppingListList.
          for (const shoppingList of shoppingLists) {
            // Check field types.
            if (!ShoppingService.checkShoppingListTypes(shoppingList)) {
              return this.push404()
            }

            // Add ShoppingList to the ShoppingLists array.
            newShoppingLists.push(ShoppingService.newShoppingListFromApiJSON(shoppingList))
          }
          return newShoppingLists
        } else { return null }
      }))
  }

  // Get one Shopping list.
  getOneShoppingList(id: string) {
    if (ValidationService.checkUUID(id)) {
      const url: string = `${environment.apiUrl}/shoppinglists/` +
        (this.authenticated ? '' : 'shared/') + id

      return this.http.get<any>(url)
        .pipe(map(shoppingList => {
          if (shoppingList) {
            // Check field types.
            if (!ShoppingService.checkShoppingListTypes(shoppingList)) {
              return this.push404()
            }

            // Return proper Shopping list object.
            return ShoppingService.newShoppingListFromApiJSON(shoppingList)
          } else { return this.push404() }
        }))
    }
    return this.push404()
  }

  // Get all ShoppingListItems by ShoppingList id.
  getAllItems(id: string) {
    console.log('service items')
    if (ValidationService.checkUUID(id)) {
      const url: string = `${environment.apiUrl}/shoppinglists/` +
        (this.authenticated ? '' : 'shared/') + `${id}/items`

      return this.http.get<any>(url)
        .pipe(map(shoppingListItems => {
          if (shoppingListItems._embedded && shoppingListItems._embedded.shoppingListItemList) {
            shoppingListItems = shoppingListItems._embedded.shoppingListItemList

            // Initialize ShoppingListItems array.
            const newShoppingListItems: ShoppingListItem[] = []

            // Loop over JSON shoppingListItemList.
            for (const item of shoppingListItems) {
              // Check field types.
              if (!ShoppingService.checkShoppingListItemTypes(item)) {
                console.log('404 bad item types')
                return this.push404()
              }

              // Add item to the ShoppingListItems array.
              newShoppingListItems.push(ShoppingService.newShoppingListItemFromApiJSON(item))
            }
            return newShoppingListItems
          } else { return null }
        }))
    }
  }

  // Delete Shopping list.
  delete(id: string) {
    if (ValidationService.checkUUID(id)) {
      return this.http.delete(`${environment.apiUrl}/shoppinglists/${id}`)
    }
    return this.push404()
  }

  // Share/Unshare Shopping list.
  share(id: string) {
    if (ValidationService.checkUUID(id)) {
      return this.http.get(`${environment.apiUrl}/shoppinglists/share/${id}`)
    }
    return this.push404()
  }

  private push404(): undefined {
    this.router.navigate(['/404']).then(r => console.log(r));
    return undefined;
  }

  private get authenticated(): boolean {
    return !!this.authenticationService.currentUserValue;
  }
}
