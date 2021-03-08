import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddNewAllKycComponent } from './add-new-all-kyc.component';

describe('AddNewAllKycComponent', () => {
  let component: AddNewAllKycComponent;
  let fixture: ComponentFixture<AddNewAllKycComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddNewAllKycComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddNewAllKycComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
