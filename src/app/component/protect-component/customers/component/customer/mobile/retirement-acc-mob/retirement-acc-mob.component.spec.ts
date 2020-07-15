import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RetirementAccMobComponent } from './retirement-acc-mob.component';

describe('RetirementAccMobComponent', () => {
  let component: RetirementAccMobComponent;
  let fixture: ComponentFixture<RetirementAccMobComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RetirementAccMobComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RetirementAccMobComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
