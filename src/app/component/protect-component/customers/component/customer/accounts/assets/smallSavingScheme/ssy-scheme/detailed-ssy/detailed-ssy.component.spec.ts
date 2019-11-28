import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailedSsyComponent } from './detailed-ssy.component';

describe('DetailedSsyComponent', () => {
  let component: DetailedSsyComponent;
  let fixture: ComponentFixture<DetailedSsyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetailedSsyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailedSsyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
