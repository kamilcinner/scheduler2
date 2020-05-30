import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ShoppingService } from '@app/shopping/_services/shopping.service';
import { ShoppingList } from '@app/shopping/_models';

@Component({
  selector: 'app-shopping-list-items-form',
  templateUrl: './shopping-list-items-form.component.html',
  styleUrls: ['./shopping-list-items-form.component.css']
})
export class ShoppingListItemsFormComponent implements OnInit {
  shoppingListItemsForm: FormGroup
  submitted = false
  loading = false
  loadingForm = true
  errors

  shoppingList: ShoppingList

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private shoppingService: ShoppingService
  ) { }

  ngOnInit(): void {
    // Get Shopping list id from URL.
    let id;
    this.route.paramMap.subscribe(params => {
      id = params.get('id')
    });

    (async () => {
      // Get Shopping list data.
      await this.getShoppingList(id)

      // Get Shopping list items.
      await this.getItems(this.shoppingList.id)

      // Add items input to form array.
      let itemNamesArray = []
      if (this.shoppingList.items.length > 0) {
        for (const item of this.shoppingList.items) {
          itemNamesArray.push(item.name)
        }
      }
      itemNamesArray.push('','','')

      // Build items form.
      this.shoppingListItemsForm = this.formBuilder.group({
        items: this.formBuilder.array(itemNamesArray)
      })

      this.loadingForm = false
    })()
  }

  // Getter for easy access to items FormArray class.
  get items() {
    return this.shoppingListItemsForm.get('items') as FormArray
  }

  onSubmit() {
    this.submitted = true
    this.loading = true

    // Stop here if form is invalid.
    if (this.shoppingListItemsForm.invalid) {
      return
    }

    // Synchronize.
    (async () => {
      // Delete all old items from Shopping list.
      await this.deleteItems(this.shoppingList.id)

      // Add new items to the Shopping list.
      for (const item of this.items.controls) {
        // Skip adding empty items.
        if (item.value !== '') {
          await this.addItem(item.value, this.shoppingList.id)
        }
      }

      // Navigate to Shopping list detail view.
      await this.router.navigate(['/shoppinglists/one', this.shoppingList.id])
    })()
  }

  // Adds empty item input.
  addItemInput(): void {
    this.items.push(this.formBuilder.control(''))
  }

  // Removes clicked item input.
  removeItemInput(index: number) {
    this.items.removeAt(index)
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

  private deleteItems(id: string) {
    console.log('Deleting items... for ' + id)
    return new Promise(resolve => {
      const result = this.shoppingService.deleteItems(id)
      if (result) {
        result.subscribe(_ => resolve())
      } else { resolve() }
    })
  }

  private addItem(name: string, id: string) {
    console.log('Adding item to ' + id)
    return new Promise(resolve => {
      const result = this.shoppingService.newItem(name, id)
      if (result) {
        result.subscribe(_ => resolve())
      } else { resolve() }
    })
  }
}
