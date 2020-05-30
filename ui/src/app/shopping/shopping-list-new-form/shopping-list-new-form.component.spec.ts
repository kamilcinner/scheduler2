import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShoppingListNewFormComponent } from './shopping-list-new-form.component';

describe('ShoppingListNewFormComponent', () => {
  let component: ShoppingListNewFormComponent;
  let fixture: ComponentFixture<ShoppingListNewFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShoppingListNewFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShoppingListNewFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
