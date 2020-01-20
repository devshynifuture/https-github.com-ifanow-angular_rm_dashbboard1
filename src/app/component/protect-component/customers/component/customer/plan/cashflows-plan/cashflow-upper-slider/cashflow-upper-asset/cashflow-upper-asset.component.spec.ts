import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CashflowUpperAssetComponent } from './cashflow-upper-asset.component';

describe('CashflowUpperAssetComponent', () => {
  let component: CashflowUpperAssetComponent;
  let fixture: ComponentFixture<CashflowUpperAssetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CashflowUpperAssetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CashflowUpperAssetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
