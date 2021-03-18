import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KycRedirectComponent } from './kyc-redirect.component';

describe('KycRedirectComponent', () => {
  let component: KycRedirectComponent;
  let fixture: ComponentFixture<KycRedirectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KycRedirectComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KycRedirectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
