import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailedPoSavingsComponent } from './detailed-po-savings.component';

describe('DetailedPoSavingsComponent', () => {
  let component: DetailedPoSavingsComponent;
  let fixture: ComponentFixture<DetailedPoSavingsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetailedPoSavingsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailedPoSavingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
