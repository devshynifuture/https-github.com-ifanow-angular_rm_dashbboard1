import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AllAdviceSmallSavingsSchemeComponent } from './all-advice-small-savings-scheme.component';

describe('AllAdviceSmallSavingsSchemeComponent', () => {
  let component: AllAdviceSmallSavingsSchemeComponent;
  let fixture: ComponentFixture<AllAdviceSmallSavingsSchemeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AllAdviceSmallSavingsSchemeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AllAdviceSmallSavingsSchemeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
