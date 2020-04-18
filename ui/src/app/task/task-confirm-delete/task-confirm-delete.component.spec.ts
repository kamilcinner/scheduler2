import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskConfirmDeleteComponent } from './task-confirm-delete.component';

describe('TaskConfirmDeleteComponent', () => {
  let component: TaskConfirmDeleteComponent;
  let fixture: ComponentFixture<TaskConfirmDeleteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TaskConfirmDeleteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TaskConfirmDeleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
