import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailedViewGratuityComponent } from './detailed-view-gratuity.component';

describe('DetailedViewGratuityComponent', () => {
  let component: DetailedViewGratuityComponent;
  let fixture: ComponentFixture<DetailedViewGratuityComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetailedViewGratuityComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailedViewGratuityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
