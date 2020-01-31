import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdviceRetirementAccountComponent } from './advice-retirement-account.component';

describe('AdviceRetirementAccountComponent', () => {
  let component: AdviceRetirementAccountComponent;
  let fixture: ComponentFixture<AdviceRetirementAccountComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdviceRetirementAccountComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdviceRetirementAccountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
