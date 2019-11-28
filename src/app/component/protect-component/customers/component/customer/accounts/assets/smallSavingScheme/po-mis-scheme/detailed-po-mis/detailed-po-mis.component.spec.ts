import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailedPoMisComponent } from './detailed-po-mis.component';

describe('DetailedPoMisComponent', () => {
  let component: DetailedPoMisComponent;
  let fixture: ComponentFixture<DetailedPoMisComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetailedPoMisComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailedPoMisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
