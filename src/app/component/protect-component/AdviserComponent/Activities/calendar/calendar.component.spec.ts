import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { calendarComponent } from './calendar.component';

describe('calendarComponent', () => {
  let component: calendarComponent;
  let fixture: ComponentFixture<calendarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ calendarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(calendarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
