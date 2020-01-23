import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditTaxComputationComponent } from './edit-tax-computation.component';

describe('EditTaxComputationComponent', () => {
  let component: EditTaxComputationComponent;
  let fixture: ComponentFixture<EditTaxComputationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditTaxComputationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditTaxComputationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
