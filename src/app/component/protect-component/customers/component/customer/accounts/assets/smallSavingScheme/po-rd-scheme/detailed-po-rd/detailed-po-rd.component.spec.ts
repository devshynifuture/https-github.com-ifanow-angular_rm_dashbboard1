import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailedPoRdComponent } from './detailed-po-rd.component';

describe('DetailedPoRdComponent', () => {
  let component: DetailedPoRdComponent;
  let fixture: ComponentFixture<DetailedPoRdComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetailedPoRdComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailedPoRdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
