import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AllInsurancelistComponent } from './all-insurancelist.component';

describe('AllInsurancelistComponent', () => {
  let component: AllInsurancelistComponent;
  let fixture: ComponentFixture<AllInsurancelistComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AllInsurancelistComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AllInsurancelistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
