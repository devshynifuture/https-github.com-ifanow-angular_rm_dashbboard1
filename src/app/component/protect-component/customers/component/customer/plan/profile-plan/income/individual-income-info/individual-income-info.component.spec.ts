import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IndividualIncomeInfoComponent } from './individual-income-info.component';

describe('IndividualIncomeInfoComponent', () => {
  let component: IndividualIncomeInfoComponent;
  let fixture: ComponentFixture<IndividualIncomeInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IndividualIncomeInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IndividualIncomeInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
