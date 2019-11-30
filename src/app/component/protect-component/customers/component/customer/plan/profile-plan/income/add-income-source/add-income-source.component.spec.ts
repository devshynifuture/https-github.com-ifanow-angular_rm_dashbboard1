import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddIncomeSourceComponent } from './add-income-source.component';

describe('AddIncomeSourceComponent', () => {
  let component: AddIncomeSourceComponent;
  let fixture: ComponentFixture<AddIncomeSourceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddIncomeSourceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddIncomeSourceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
