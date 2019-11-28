import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailedViewEPFComponent } from './detailed-view-epf.component';

describe('DetailedViewEPFComponent', () => {
  let component: DetailedViewEPFComponent;
  let fixture: ComponentFixture<DetailedViewEPFComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetailedViewEPFComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailedViewEPFComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
