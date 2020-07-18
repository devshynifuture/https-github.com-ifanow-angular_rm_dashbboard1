import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailedPpfComponent } from './detailed-ppf.component';

describe('DetailedPpfComponent', () => {
  let component: DetailedPpfComponent;
  let fixture: ComponentFixture<DetailedPpfComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetailedPpfComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailedPpfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
