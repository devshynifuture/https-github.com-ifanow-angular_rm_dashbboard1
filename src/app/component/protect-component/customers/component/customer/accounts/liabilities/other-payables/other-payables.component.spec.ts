import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OtherPayablesComponent } from './other-payables.component';

describe('OtherPayablesComponent', () => {
  let component: OtherPayablesComponent;
  let fixture: ComponentFixture<OtherPayablesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OtherPayablesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OtherPayablesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
