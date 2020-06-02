import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { AuthenticationService } from '@app/_services'
import { ShoppingList, ShoppingListItem } from '@app/shopping/_models'
import { environment } from '@environments/environment'
import { map } from 'rxjs/operators'
import { ValidationService } from '@app/_services/validation.service'

@Injectable({
  providedIn: 'root'
})
export class ShoppingService {

  constructor(
    private http: HttpClient,
    private authenticationService: AuthenticationService
  ) { }

  // Checks if every Shopping list field send from API is in acceptable format.
  private static checkShoppingListTypes(shoppingList): boolean {
    return !(typeof shoppingList.id !== 'string' || typeof shoppingList.ownerUsername !== 'string' ||
      typeof shoppingList.name !== 'string' || typeof shoppingList.lastEditDateTime !== 'string' ||
      typeof shoppingList.shared !== 'boolean')
  }

  // Checks if every Shopping list Item field send from API is in acceptable format.
  private static checkShoppingListItemTypes(shoppingListItem): boolean {
    return !(typeof shoppingListItem.id !== 'string' || typeof shoppingListItem.name !== 'string' ||
      typeof shoppingListItem.done !== 'boolean')
  }

  // Returns proper Shopping list Item object created from API JSON.
  private static newShoppingListItemFromApiJSON(shoppingListItem): ShoppingListItem {
    const newShoppingListItem = new ShoppingListItem(shoppingListItem.id, shoppingListItem.name, shoppingListItem.done)
    console.log('Saved Shopping list Item.', newShoppingListItem)
    return newShoppingListItem
  }

  // Returns proper Shopping list object created from API JSON.
  private static newShoppingListFromApiJSON(shoppingList): ShoppingList {
    const newShoppingList = new ShoppingList(shoppingList.id, shoppingList.ownerUsername, shoppingList.name,
      new Date(shoppingList.lastEditDateTime), shoppingList.shared, [])
    console.log('Saved Shopping list.', newShoppingList)
    return newShoppingList
  }

  /**
   * Gets all Shopping lists from API.
   * @return Observable<ShoppingList[]> or Observable<null> if there is no any Shopping list returned from API.
   */
  getAllShoppingLists() {
    return this.http.get<any>(`${environment.apiUrl}/shoppinglists`)
      .pipe(map(shoppingLists => {
        if (shoppingLists._embedded && shoppingLists._embedded.shoppingListList) {
          shoppingLists = shoppingLists._embedded.shoppingListList

          // Initialize Shopping lists array.
          const newShoppingLists: ShoppingList[] = []

          // Loop over JSON shoppingListList.
          for (const shoppingList of shoppingLists) {
            // Check field types.
            if (!ShoppingService.checkShoppingListTypes(shoppingList)) {
              return null
            }

            // Add Shopping list to the Shopping lists array.
            newShoppingLists.push(ShoppingService.newShoppingListFromApiJSON(shoppingList))
          }
          return newShoppingLists
        }
        else { return null }
      }))
  }

  /**
   * Gets one Shopping list from API by id.
   * @param id (UUID string) of the Shopping list.
   * @return Observable or null if id is invalid UUID.
   */
  getOneShoppingList(id: string) {
    if (ValidationService.checkUUID(id)) {
      const url: string = `${environment.apiUrl}/shoppinglists/` +
        (this.authenticationService.authenticated ? '' : 'shared/') + id

      return this.http.get<any>(url)
        .pipe(map(shoppingList => {
          if (shoppingList) {
            // Check field types.
            if (!ShoppingService.checkShoppingListTypes(shoppingList)) {
              return null
            }

            // Return proper Shopping list object.
            return ShoppingService.newShoppingListFromApiJSON(shoppingList)
          } else { return null }
        }))
    }
    // Id is invalid UUID.
    return null
  }

  /**
   * Gets all Shopping list Items by Shopping list id.
   * @param id (UUID string) of the parent Shopping list.
   * @return Observable or null if id is invalid UUID.
   */
  getAllItems(id: string) {
    if (ValidationService.checkUUID(id)) {
      const url: string = `${environment.apiUrl}/shoppinglists/` +
        (this.authenticationService.authenticated ? '' : 'shared/') + `${id}/items`

      return this.http.get<any>(url)
        .pipe(map(shoppingListItems => {
          if (shoppingListItems._embedded && shoppingListItems._embedded.shoppingListItemList) {
            shoppingListItems = shoppingListItems._embedded.shoppingListItemList

            // Initialize Shopping list Items array.
            const newShoppingListItems: ShoppingListItem[] = []

            // Loop over JSON shopping list Item List.
            for (const item of shoppingListItems) {
              // Check field types.
              if (!ShoppingService.checkShoppingListItemTypes(item)) {
                return null
              }

              // Add item to the Shopping list Items array.
              newShoppingListItems.push(ShoppingService.newShoppingListItemFromApiJSON(item))
            }
            return newShoppingListItems
          } else { return null }
        }))
    }
    // Id is invalid UUID.
    return null
  }

  // Create new Shopping list.
  newShoppingList(name: string) {
    return this.http.post<any>(`${environment.apiUrl}/shoppinglists`, { name })
  }

  // Create new Shopping list item.
  newItem(name: string, done: boolean, id: string) {
    if (ValidationService.checkUUID(id)) {
      return this.http.post<any>(`${environment.apiUrl}/shoppinglists/${id}/items`, { name, done })
    }
    // Id is invalid UUID.
    return null
  }

  // Delete all items by Shopping list.
  deleteItems(id: string) {
    if (ValidationService.checkUUID(id)) {
      return this.http.delete(`${environment.apiUrl}/shoppinglists/${id}/items`)
    }
    // Id is invalid UUID.
    return null
  }

  // Mark Item done/undone.
  markItem(id: string) {
    if (ValidationService.checkUUID(id)) {
      return this.http.get(`${environment.apiUrl}/shoppinglists/items/${id}/mark`)
    }
    // Id is invalid UUID.
    return null
  }

  // Delete Shopping list.
  deleteShoppingList(id: string) {
    if (ValidationService.checkUUID(id)) {
      return this.http.delete(`${environment.apiUrl}/shoppinglists/${id}`)
    }
    // Id is invalid UUID.
    return null
  }

  // Share/Unshare Shopping list.
  shareShoppingList(id: string) {
    if (ValidationService.checkUUID(id)) {
      return this.http.get(`${environment.apiUrl}/shoppinglists/${id}/share`)
    }
    // Id is invalid UUID.
    return null
  }
}
