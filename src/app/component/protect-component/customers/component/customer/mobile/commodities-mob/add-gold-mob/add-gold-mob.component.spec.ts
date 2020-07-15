import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddGoldMobComponent } from './add-gold-mob.component';

describe('AddGoldMobComponent', () => {
  let component: AddGoldMobComponent;
  let fixture: ComponentFixture<AddGoldMobComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddGoldMobComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddGoldMobComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
