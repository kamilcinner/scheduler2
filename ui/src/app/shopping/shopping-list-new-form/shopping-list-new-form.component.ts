import { Component, OnInit } from '@angular/core'
import { FormBuilder, FormGroup } from '@angular/forms'
import { ActivatedRoute, Router } from '@angular/router'
import { ShoppingService } from '@app/shopping/_services/shopping.service'
import { ValidationService } from '@app/_services/validation.service'

@Component({
  selector: 'app-shopping-list-new-form',
  templateUrl: './shopping-list-new-form.component.html',
  styleUrls: ['./shopping-list-new-form.component.css']
})
export class ShoppingListNewFormComponent implements OnInit {
  shoppingListForm: FormGroup
  loading = false
  errors

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private shoppingService: ShoppingService
  ) { }

  ngOnInit(): void {
    // Build default form.
    this.shoppingListForm = this.formBuilder.group({
      name: ''
    })
  }

  // Convenience getter for easy access to form fields.
  get f() { return this.shoppingListForm.controls; }

  onSubmit() {
    this.loading = true

    // Stop here if form is invalid.
    if (this.shoppingListForm.invalid) {
      this.loading = false
      return
    }

    this.shoppingService.newShoppingList(this.f.name.value).subscribe(
      shoppingList => {
        if (shoppingList && shoppingList.id && ValidationService.checkUUID(shoppingList.id)) {
          this.router.navigate(['/shoppinglists/update', shoppingList.id]).then(
            () => console.log(`Created Shopping list ${shoppingList.id}.`)
          )
        }
        else {
          alert('Something went wrong :( Please, try again :)')
          this.loading = false
        }
      },
      errors => {
        this.errors = errors
        this.loading = false
      }
    )
  }
}
