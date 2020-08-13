import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResetClientPasswordComponent } from './reset-client-password.component';

describe('ResetClientPasswordComponent', () => {
  let component: ResetClientPasswordComponent;
  let fixture: ComponentFixture<ResetClientPasswordComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ResetClientPasswordComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResetClientPasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
