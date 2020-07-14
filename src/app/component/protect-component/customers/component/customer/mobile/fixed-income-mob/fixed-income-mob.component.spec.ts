import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FixedIncomeMobComponent } from './fixed-income-mob.component';

describe('FixedIncomeMobComponent', () => {
  let component: FixedIncomeMobComponent;
  let fixture: ComponentFixture<FixedIncomeMobComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FixedIncomeMobComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FixedIncomeMobComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
