import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditBankMobileViewComponent } from './add-edit-bank-mobile-view.component';

describe('AddEditBankMobileViewComponent', () => {
  let component: AddEditBankMobileViewComponent;
  let fixture: ComponentFixture<AddEditBankMobileViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddEditBankMobileViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddEditBankMobileViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
