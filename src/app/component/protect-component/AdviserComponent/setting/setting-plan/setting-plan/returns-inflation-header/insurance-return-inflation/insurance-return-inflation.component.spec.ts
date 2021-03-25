import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InsuranceReturnInflationComponent } from './insurance-return-inflation.component';

describe('InsuranceReturnInflationComponent', () => {
  let component: InsuranceReturnInflationComponent;
  let fixture: ComponentFixture<InsuranceReturnInflationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InsuranceReturnInflationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InsuranceReturnInflationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
