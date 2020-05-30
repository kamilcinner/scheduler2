import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShoppingListItemsFormComponent } from './shopping-list-items-form.component';

describe('ShoppingListItemsFormComponent', () => {
  let component: ShoppingListItemsFormComponent;
  let fixture: ComponentFixture<ShoppingListItemsFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShoppingListItemsFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShoppingListItemsFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
