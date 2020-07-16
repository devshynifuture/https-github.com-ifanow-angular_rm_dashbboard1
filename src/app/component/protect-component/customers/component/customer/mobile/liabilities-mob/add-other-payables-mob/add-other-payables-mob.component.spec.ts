import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddOtherPayablesMobComponent } from './add-other-payables-mob.component';

describe('AddOtherPayablesMobComponent', () => {
  let component: AddOtherPayablesMobComponent;
  let fixture: ComponentFixture<AddOtherPayablesMobComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddOtherPayablesMobComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddOtherPayablesMobComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
