import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailedViewBondsComponent } from './detailed-view-bonds.component';

describe('DetailedViewBondsComponent', () => {
  let component: DetailedViewBondsComponent;
  let fixture: ComponentFixture<DetailedViewBondsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetailedViewBondsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailedViewBondsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
