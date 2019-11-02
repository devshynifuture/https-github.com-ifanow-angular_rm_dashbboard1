import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VariableFeeComponent } from './variable-fee.component';

describe('VariableFeeComponent', () => {
  let component: VariableFeeComponent;
  let fixture: ComponentFixture<VariableFeeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VariableFeeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VariableFeeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
