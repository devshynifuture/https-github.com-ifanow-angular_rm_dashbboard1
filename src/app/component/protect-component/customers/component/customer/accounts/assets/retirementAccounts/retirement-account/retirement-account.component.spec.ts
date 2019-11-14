import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RetirementAccountComponent } from './retirement-account.component';

describe('RetirementAccountComponent', () => {
  let component: RetirementAccountComponent;
  let fixture: ComponentFixture<RetirementAccountComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RetirementAccountComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RetirementAccountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
