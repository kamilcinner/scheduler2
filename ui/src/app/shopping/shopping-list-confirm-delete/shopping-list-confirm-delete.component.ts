import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core'
import { ShoppingList } from '@app/shopping/_models'

@Component({
  selector: 'app-shopping-list-confirm-delete',
  templateUrl: './shopping-list-confirm-delete.component.html',
  styleUrls: ['./shopping-list-confirm-delete.component.css']
})
export class ShoppingListConfirmDeleteComponent implements OnInit {

  @Input() shoppingList: ShoppingList

  @Output() confirmDelete = new EventEmitter()
  @Output() abortDelete = new EventEmitter()

  constructor() { }

  ngOnInit(): void {
  }

}
