import { Component } from '@angular/core'
import { FormArray, FormBuilder, FormGroup } from '@angular/forms'
import { ActivatedRoute, Router } from '@angular/router'
import { ShoppingService } from '@app/shopping/_services/shopping.service'
import { ShoppingList } from '@app/shopping/_models'
import { ShoppingListDetailComponent } from '@app/shopping/shopping-list-detail'
import { AuthenticationService } from '@app/_services'
import { PageNotFound } from '@app/_helpers'

@Component({
  selector: 'app-shopping-list-items-form',
  templateUrl: './shopping-list-items-form.component.html',
  styleUrls: ['./shopping-list-items-form.component.css']
})
export class ShoppingListItemsFormComponent extends ShoppingListDetailComponent {
  shoppingListItemsForm: FormGroup
  loading = false
  loadingForm = true
  errors

  shoppingList: ShoppingList

  constructor(
    private formBuilder: FormBuilder,
    protected router: Router,
    protected route: ActivatedRoute,
    protected shoppingService: ShoppingService,

    protected authenticationService: AuthenticationService
  ) {
    super(shoppingService, route, router, authenticationService);
  }

  ngOnInit(): void {
    // Get Shopping list id from URL.
    let id
    this.route.paramMap.subscribe(params => {
      id = params.get('id')
    });

    // Get Shopping list data from server.
    // Synchronize.
    (async () => {
      // Get Shopping list data.
      await this.getShoppingList(id)

      // Get Shopping list Items.
      await this.getItems(this.shoppingList.id)

      // Add Items input to form array.
      let itemsArray = []
      if (this.shoppingList.items.length > 0) {
        for (const item of this.shoppingList.items) {
          itemsArray.push(this.formBuilder.group({
            name: item.name,
            done: item.done
          }))
        }
      }

      // Add 3 dummy inputs for user comfort.
      for (let i = 0; i < 3; i++) {
        itemsArray.push(this.formBuilder.group({
          name: '',
          done: false
        }))
      }

      // Build items form.
      this.shoppingListItemsForm = this.formBuilder.group({
        items: this.formBuilder.array(itemsArray)
      })

      this.loadingForm = false
    })()
  }

  // Getter for easy access to items FormArray class.
  get items() {
    return this.shoppingListItemsForm.get('items') as FormArray
  }

  onSubmit() {
    this.loading = true

    // Stop here if form is invalid.
    if (this.shoppingListItemsForm.invalid) {
      this.loading = false
      return
    }

    // Synchronize.
    (async () => {
      // Delete all old Items from Shopping list.
      await this.removeItems(this.shoppingList.id)

      // Add new Items to the Shopping list.
      for (const item of this.items.controls) {
        // Skip adding Items with empty name inputs.
        if (item.value.name && item.value.name !== '') {
          let isDone = item.value.done
          // If the Item has been changed then send it to API as undone.
          if (item.touched) {
            isDone = false
          }
          await this.addItem(item.value.name, isDone, this.shoppingList.id)
        }
      }

      // Navigate to Shopping list detail view.
      await this.router.navigate(['/shoppinglists/one', this.shoppingList.id]).then(
        () => console.log(`Redirecting to Shopping list ${this.shoppingList.id} detail view.`)
      )
    })()
  }

  // Adds empty Item input.
  addItemInput(): void {
    this.items.push(this.formBuilder.group({
      name: '',
      done: false
    }))
  }

  // Removes clicked Item input.
  removeItemInput(index: number) {
    this.items.removeAt(index)
  }

  private removeItems(id: string) {
    return new Promise(resolve => {
      const result = this.shoppingService.deleteItems(id)
      if (result) {
        result.subscribe(() => {
          console.log(`Deleted all Items from ${id}.`)
          resolve()
        })
      }
      else {
        // If id is an invalid UUID.
        PageNotFound.redirect(this.router)
        resolve()
      }
    })
  }

  private addItem(name: string, done: boolean, id: string) {
    return new Promise(resolve => {
      const result = this.shoppingService.newItem(name, done, id)
      if (result) {
        result.subscribe(() => {
          console.log(`Added an Item to ${id}.`)
          resolve()
        })
      }
      else {
        // If id is an invalid UUID.
        PageNotFound.redirect(this.router)
        resolve()
      }
    })
  }
}
