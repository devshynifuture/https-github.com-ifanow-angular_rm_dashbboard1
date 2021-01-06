import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CredentialsErrorPopupComponent } from './credentials-error-popup.component';

describe('CredentialsErrorPopupComponent', () => {
  let component: CredentialsErrorPopupComponent;
  let fixture: ComponentFixture<CredentialsErrorPopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CredentialsErrorPopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CredentialsErrorPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
