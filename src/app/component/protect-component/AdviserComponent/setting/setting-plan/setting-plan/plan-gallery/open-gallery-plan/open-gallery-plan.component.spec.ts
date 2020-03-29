import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OpenGalleryPlanComponent } from './open-gallery-plan.component';

describe('OpenGalleryPlanComponent', () => {
  let component: OpenGalleryPlanComponent;
  let fixture: ComponentFixture<OpenGalleryPlanComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OpenGalleryPlanComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OpenGalleryPlanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
