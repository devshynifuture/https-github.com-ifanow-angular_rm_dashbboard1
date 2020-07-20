import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailedViewRealEstateMobComponent } from './detailed-view-real-estate-mob.component';

describe('DetailedViewRealEstateMobComponent', () => {
  let component: DetailedViewRealEstateMobComponent;
  let fixture: ComponentFixture<DetailedViewRealEstateMobComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetailedViewRealEstateMobComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailedViewRealEstateMobComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
