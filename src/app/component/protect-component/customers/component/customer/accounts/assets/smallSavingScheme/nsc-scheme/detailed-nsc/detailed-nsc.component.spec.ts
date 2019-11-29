import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailedNscComponent } from './detailed-nsc.component';

describe('DetailedNscComponent', () => {
  let component: DetailedNscComponent;
  let fixture: ComponentFixture<DetailedNscComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetailedNscComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailedNscComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
