import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BankDetailedAssetsComponent } from './bank-detailed-assets.component';

describe('BankDetailedAssetsComponent', () => {
  let component: BankDetailedAssetsComponent;
  let fixture: ComponentFixture<BankDetailedAssetsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BankDetailedAssetsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BankDetailedAssetsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
