import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddOtherPayablesComponent } from './add-other-payables.component';

describe('AddOtherPayablesComponent', () => {
  let component: AddOtherPayablesComponent;
  let fixture: ComponentFixture<AddOtherPayablesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddOtherPayablesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddOtherPayablesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
