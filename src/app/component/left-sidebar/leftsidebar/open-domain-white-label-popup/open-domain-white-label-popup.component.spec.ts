import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OpenDomainWhiteLabelPopupComponent } from './open-domain-white-label-popup.component';

describe('OpenDomainWhiteLabelPopupComponent', () => {
  let component: OpenDomainWhiteLabelPopupComponent;
  let fixture: ComponentFixture<OpenDomainWhiteLabelPopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OpenDomainWhiteLabelPopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OpenDomainWhiteLabelPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
