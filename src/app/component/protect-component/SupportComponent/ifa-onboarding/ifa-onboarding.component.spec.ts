import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IfaOnboardingComponent } from './ifa-onboarding.component';

describe('IfaOnboardingComponent', () => {
  let component: IfaOnboardingComponent;
  let fixture: ComponentFixture<IfaOnboardingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IfaOnboardingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IfaOnboardingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
