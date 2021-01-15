import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddSovereignGoldBondsComponent } from './add-sovereign-gold-bonds.component';

describe('AddSovereignGoldBondsComponent', () => {
  let component: AddSovereignGoldBondsComponent;
  let fixture: ComponentFixture<AddSovereignGoldBondsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddSovereignGoldBondsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddSovereignGoldBondsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
