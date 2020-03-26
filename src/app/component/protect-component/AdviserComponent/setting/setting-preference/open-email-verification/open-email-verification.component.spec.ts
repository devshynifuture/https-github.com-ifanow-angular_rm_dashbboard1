import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OpenEmailVerificationComponent } from './open-email-verification.component';

describe('OpenEmailVerificationComponent', () => {
  let component: OpenEmailVerificationComponent;
  let fixture: ComponentFixture<OpenEmailVerificationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OpenEmailVerificationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OpenEmailVerificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
