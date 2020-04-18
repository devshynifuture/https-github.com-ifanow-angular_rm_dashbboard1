import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SignupProgressBarComponent } from './signup-progress-bar.component';

describe('SignupProgressBarComponent', () => {
  let component: SignupProgressBarComponent;
  let fixture: ComponentFixture<SignupProgressBarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SignupProgressBarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SignupProgressBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
