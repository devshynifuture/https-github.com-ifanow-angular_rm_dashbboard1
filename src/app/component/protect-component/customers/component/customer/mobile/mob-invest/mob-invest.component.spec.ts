import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MobInvestComponent } from './mob-invest.component';

describe('MobInvestComponent', () => {
  let component: MobInvestComponent;
  let fixture: ComponentFixture<MobInvestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MobInvestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MobInvestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
