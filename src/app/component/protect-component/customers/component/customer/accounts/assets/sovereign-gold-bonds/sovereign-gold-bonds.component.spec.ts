import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SovereignGoldBondsComponent } from './sovereign-gold-bonds.component';

describe('SovereignGoldBondsComponent', () => {
  let component: SovereignGoldBondsComponent;
  let fixture: ComponentFixture<SovereignGoldBondsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SovereignGoldBondsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SovereignGoldBondsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
