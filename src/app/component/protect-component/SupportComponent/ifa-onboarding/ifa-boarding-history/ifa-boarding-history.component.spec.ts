import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IfaBoardingHistoryComponent } from './ifa-boarding-history.component';

describe('IfaBoradingHistoryComponent', () => {
  let component: IfaBoardingHistoryComponent;
  let fixture: ComponentFixture<IfaBoardingHistoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [IfaBoardingHistoryComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IfaBoardingHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
