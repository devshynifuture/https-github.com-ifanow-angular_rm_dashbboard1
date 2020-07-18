import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddHealthMobComponent } from './add-health-mob.component';

describe('AddHealthMobComponent', () => {
  let component: AddHealthMobComponent;
  let fixture: ComponentFixture<AddHealthMobComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddHealthMobComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddHealthMobComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
