import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailedViewOtherPayablesComponent } from './detailed-view-other-payables.component';

describe('DetailedViewOtherPayablesComponent', () => {
  let component: DetailedViewOtherPayablesComponent;
  let fixture: ComponentFixture<DetailedViewOtherPayablesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetailedViewOtherPayablesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailedViewOtherPayablesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
