import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AgePopupComponent } from './age-popup.component';

describe('AgePopupComponent', () => {
  let component: AgePopupComponent;
  let fixture: ComponentFixture<AgePopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AgePopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AgePopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
