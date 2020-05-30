import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShoppingListConfirmDeleteComponent } from './shopping-list-confirm-delete.component';

describe('ShoppingListConfirmDeleteComponent', () => {
  let component: ShoppingListConfirmDeleteComponent;
  let fixture: ComponentFixture<ShoppingListConfirmDeleteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShoppingListConfirmDeleteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShoppingListConfirmDeleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
