import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailedViewGoldComponent } from './detailed-view-gold.component';

describe('DetailedViewGoldComponent', () => {
  let component: DetailedViewGoldComponent;
  let fixture: ComponentFixture<DetailedViewGoldComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetailedViewGoldComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailedViewGoldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
