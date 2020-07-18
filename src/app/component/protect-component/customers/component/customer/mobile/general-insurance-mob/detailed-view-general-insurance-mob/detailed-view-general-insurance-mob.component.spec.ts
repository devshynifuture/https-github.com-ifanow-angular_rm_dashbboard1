import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailedViewGeneralInsuranceMobComponent } from './detailed-view-general-insurance-mob.component';

describe('DetailedViewGeneralInsuranceMobComponent', () => {
  let component: DetailedViewGeneralInsuranceMobComponent;
  let fixture: ComponentFixture<DetailedViewGeneralInsuranceMobComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetailedViewGeneralInsuranceMobComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailedViewGeneralInsuranceMobComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
