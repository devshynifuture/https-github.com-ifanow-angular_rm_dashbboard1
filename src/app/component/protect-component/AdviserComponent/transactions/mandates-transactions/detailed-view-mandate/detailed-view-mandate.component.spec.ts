import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailedViewMandateComponent } from './detailed-view-mandate.component';

describe('DetailedViewMandateComponent', () => {
  let component: DetailedViewMandateComponent;
  let fixture: ComponentFixture<DetailedViewMandateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetailedViewMandateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailedViewMandateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
