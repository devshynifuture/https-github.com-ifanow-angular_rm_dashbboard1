import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SuggestHealthInsuranceComponent } from './suggest-health-insurance.component';

describe('SuggestHealthInsuranceComponent', () => {
  let component: SuggestHealthInsuranceComponent;
  let fixture: ComponentFixture<SuggestHealthInsuranceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SuggestHealthInsuranceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SuggestHealthInsuranceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
