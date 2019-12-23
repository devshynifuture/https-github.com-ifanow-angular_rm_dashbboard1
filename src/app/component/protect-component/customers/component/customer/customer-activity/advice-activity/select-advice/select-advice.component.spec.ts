import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectAdviceComponent } from './select-advice.component';

describe('SelectAdviceComponent', () => {
  let component: SelectAdviceComponent;
  let fixture: ComponentFixture<SelectAdviceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SelectAdviceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectAdviceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
