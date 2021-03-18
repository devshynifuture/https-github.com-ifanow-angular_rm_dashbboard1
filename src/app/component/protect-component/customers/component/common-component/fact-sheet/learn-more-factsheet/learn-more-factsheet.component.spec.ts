import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LearnMoreFactsheetComponent } from './learn-more-factsheet.component';

describe('LearnMoreFactsheetComponent', () => {
  let component: LearnMoreFactsheetComponent;
  let fixture: ComponentFixture<LearnMoreFactsheetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LearnMoreFactsheetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LearnMoreFactsheetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
