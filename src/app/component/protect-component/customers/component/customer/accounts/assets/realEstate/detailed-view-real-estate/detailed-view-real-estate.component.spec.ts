import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailedViewRealEstateComponent } from './detailed-view-real-estate.component';

describe('DetailedViewRealEstateComponent', () => {
  let component: DetailedViewRealEstateComponent;
  let fixture: ComponentFixture<DetailedViewRealEstateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetailedViewRealEstateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailedViewRealEstateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
