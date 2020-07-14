import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MobileViewAddressComponent } from './mobile-view-address.component';

describe('MobileViewAddressComponent', () => {
  let component: MobileViewAddressComponent;
  let fixture: ComponentFixture<MobileViewAddressComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MobileViewAddressComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MobileViewAddressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
