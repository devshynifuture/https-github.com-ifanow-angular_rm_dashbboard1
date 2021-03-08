import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageKycComponent } from './manage-kyc.component';

describe('ManageKycComponent', () => {
  let component: ManageKycComponent;
  let fixture: ComponentFixture<ManageKycComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManageKycComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageKycComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
