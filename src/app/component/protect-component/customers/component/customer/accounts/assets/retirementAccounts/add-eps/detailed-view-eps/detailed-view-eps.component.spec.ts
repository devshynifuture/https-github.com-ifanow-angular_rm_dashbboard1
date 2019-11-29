import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailedViewEPSComponent } from './detailed-view-eps.component';

describe('DetailedViewEPSComponent', () => {
  let component: DetailedViewEPSComponent;
  let fixture: ComponentFixture<DetailedViewEPSComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetailedViewEPSComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailedViewEPSComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
