import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ShoppingService } from '@app/shopping/_services/shopping.service';
import { ValidationService } from '@app/_services/validation.service';

@Component({
  selector: 'app-shopping-list-new-form',
  templateUrl: './shopping-list-new-form.component.html',
  styleUrls: ['./shopping-list-new-form.component.css']
})
export class ShoppingListNewFormComponent implements OnInit {
  shoppingListForm: FormGroup
  submitted = false
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
    this.submitted = true
    this.loading = true

    // Stop here if form is invalid.
    if (this.shoppingListForm.invalid) {
      return
    }

    this.shoppingService.newShoppingList(this.f.name.value).subscribe(
      shoppingList => {
        if (shoppingList && shoppingList.id && ValidationService.checkUUID(shoppingList.id)) {
          // this.router.navigate(['/shoppinglists/update', shoppingList.id]).then(r => console.log(r))
          this.router.navigate(['/shoppinglists']).then(r => console.log(r))
        } else {
          alert('Something went wrong.')
        }
      },
      errors => {
        this.errors = errors
        this.loading = false
      }
    )
  }
}
