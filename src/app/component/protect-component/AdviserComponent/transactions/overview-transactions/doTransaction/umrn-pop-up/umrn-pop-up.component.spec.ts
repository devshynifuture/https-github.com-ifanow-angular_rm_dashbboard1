import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UmrnPopUpComponent } from './umrn-pop-up.component';

describe('UmrnPopUpComponent', () => {
  let component: UmrnPopUpComponent;
  let fixture: ComponentFixture<UmrnPopUpComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UmrnPopUpComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UmrnPopUpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
