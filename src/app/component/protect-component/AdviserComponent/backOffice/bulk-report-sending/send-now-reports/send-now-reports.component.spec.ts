import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SendNowReportsComponent } from './send-now-reports.component';

describe('SendNowReportsComponent', () => {
  let component: SendNowReportsComponent;
  let fixture: ComponentFixture<SendNowReportsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SendNowReportsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SendNowReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
