import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OpenmobilePopupComponent } from './openmobile-popup.component';

describe('OpenmobilePopupComponent', () => {
  let component: OpenmobilePopupComponent;
  let fixture: ComponentFixture<OpenmobilePopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OpenmobilePopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OpenmobilePopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
