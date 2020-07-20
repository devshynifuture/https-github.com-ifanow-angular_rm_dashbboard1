import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BondMobComponent } from './bond-mob.component';

describe('BondMobComponent', () => {
  let component: BondMobComponent;
  let fixture: ComponentFixture<BondMobComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BondMobComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BondMobComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
