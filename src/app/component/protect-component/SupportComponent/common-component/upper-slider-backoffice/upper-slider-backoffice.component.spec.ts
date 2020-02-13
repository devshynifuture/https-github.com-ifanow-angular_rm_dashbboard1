import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UpperSliderBackofficeComponent } from './upper-slider-backoffice.component';

describe('UpperSliderBackofficeComponent', () => {
  let component: UpperSliderBackofficeComponent;
  let fixture: ComponentFixture<UpperSliderBackofficeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UpperSliderBackofficeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UpperSliderBackofficeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
