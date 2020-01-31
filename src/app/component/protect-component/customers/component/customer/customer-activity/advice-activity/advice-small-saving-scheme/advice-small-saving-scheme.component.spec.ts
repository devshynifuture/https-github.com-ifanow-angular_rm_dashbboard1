import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdviceSmallSavingSchemeComponent } from './advice-small-saving-scheme.component';

describe('AdviceSmallSavingSchemeComponent', () => {
  let component: AdviceSmallSavingSchemeComponent;
  let fixture: ComponentFixture<AdviceSmallSavingSchemeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdviceSmallSavingSchemeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdviceSmallSavingSchemeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
