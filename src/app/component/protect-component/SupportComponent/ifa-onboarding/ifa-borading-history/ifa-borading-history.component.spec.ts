import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IfaBoradingHistoryComponent } from './ifa-borading-history.component';

describe('IfaBoradingHistoryComponent', () => {
  let component: IfaBoradingHistoryComponent;
  let fixture: ComponentFixture<IfaBoradingHistoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IfaBoradingHistoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IfaBoradingHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
