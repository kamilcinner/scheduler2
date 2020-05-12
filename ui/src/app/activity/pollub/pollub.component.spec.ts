import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PollubComponent } from './pollub.component';

describe('PollubComponent', () => {
  let component: PollubComponent;
  let fixture: ComponentFixture<PollubComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PollubComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PollubComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
