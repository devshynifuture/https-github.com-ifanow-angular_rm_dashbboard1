import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MobileViewAddNumberComponent } from './mobile-view-add-number.component';

describe('MobileViewAddNumberComponent', () => {
  let component: MobileViewAddNumberComponent;
  let fixture: ComponentFixture<MobileViewAddNumberComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MobileViewAddNumberComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MobileViewAddNumberComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
