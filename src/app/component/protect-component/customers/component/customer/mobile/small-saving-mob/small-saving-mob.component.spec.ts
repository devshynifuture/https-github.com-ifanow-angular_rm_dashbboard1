import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SmallSavingMobComponent } from './small-saving-mob.component';

describe('SmallSavingMobComponent', () => {
  let component: SmallSavingMobComponent;
  let fixture: ComponentFixture<SmallSavingMobComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SmallSavingMobComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SmallSavingMobComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
