import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssetStocksComponent } from './asset-stocks.component';

describe('AssetStocksComponent', () => {
  let component: AssetStocksComponent;
  let fixture: ComponentFixture<AssetStocksComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssetStocksComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssetStocksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
