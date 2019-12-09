import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddAssetStocksComponent } from './add-asset-stocks.component';

describe('AddAssetStocksComponent', () => {
  let component: AddAssetStocksComponent;
  let fixture: ComponentFixture<AddAssetStocksComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddAssetStocksComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddAssetStocksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
