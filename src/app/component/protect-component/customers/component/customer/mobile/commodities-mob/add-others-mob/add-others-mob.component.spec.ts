import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddOthersMobComponent } from './add-others-mob.component';

describe('AddOthersMobComponent', () => {
  let component: AddOthersMobComponent;
  let fixture: ComponentFixture<AddOthersMobComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddOthersMobComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddOthersMobComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
