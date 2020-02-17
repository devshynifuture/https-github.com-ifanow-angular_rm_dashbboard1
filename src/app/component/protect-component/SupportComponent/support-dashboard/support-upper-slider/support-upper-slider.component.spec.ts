import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SupportUpperSliderComponent } from './support-upper-slider.component';

describe('SupportUpperSliderComponent', () => {
  let component: SupportUpperSliderComponent;
  let fixture: ComponentFixture<SupportUpperSliderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SupportUpperSliderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SupportUpperSliderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
