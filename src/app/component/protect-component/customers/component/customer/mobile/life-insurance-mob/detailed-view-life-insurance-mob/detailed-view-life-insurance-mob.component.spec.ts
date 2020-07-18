import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailedViewLifeInsuranceMobComponent } from './detailed-view-life-insurance-mob.component';

describe('DetailedViewLifeInsuranceMobComponent', () => {
  let component: DetailedViewLifeInsuranceMobComponent;
  let fixture: ComponentFixture<DetailedViewLifeInsuranceMobComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetailedViewLifeInsuranceMobComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailedViewLifeInsuranceMobComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
