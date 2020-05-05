import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivityConfirmDeleteComponent } from './activity-confirm-delete.component';

describe('ActivityConfirmDeleteComponent', () => {
  let component: ActivityConfirmDeleteComponent;
  let fixture: ComponentFixture<ActivityConfirmDeleteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ActivityConfirmDeleteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActivityConfirmDeleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
