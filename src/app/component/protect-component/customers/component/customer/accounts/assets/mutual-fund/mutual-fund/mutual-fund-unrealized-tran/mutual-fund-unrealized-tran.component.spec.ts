import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MutualFundUnrealizedTranComponent } from './mutual-fund-unrealized-tran.component';

describe('MutualFundUnrealizedTranComponent', () => {
  let component: MutualFundUnrealizedTranComponent;
  let fixture: ComponentFixture<MutualFundUnrealizedTranComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MutualFundUnrealizedTranComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MutualFundUnrealizedTranComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
