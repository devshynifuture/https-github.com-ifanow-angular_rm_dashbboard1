import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailedPoTdComponent } from './detailed-po-td.component';

describe('DetailedPoTdComponent', () => {
  let component: DetailedPoTdComponent;
  let fixture: ComponentFixture<DetailedPoTdComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetailedPoTdComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailedPoTdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
