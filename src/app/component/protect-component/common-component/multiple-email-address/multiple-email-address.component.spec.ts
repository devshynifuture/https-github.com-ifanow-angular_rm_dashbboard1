import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MultipleEmailAddressComponent } from './multiple-email-address.component';

describe('MultipleEmailAddressComponent', () => {
  let component: MultipleEmailAddressComponent;
  let fixture: ComponentFixture<MultipleEmailAddressComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MultipleEmailAddressComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MultipleEmailAddressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
