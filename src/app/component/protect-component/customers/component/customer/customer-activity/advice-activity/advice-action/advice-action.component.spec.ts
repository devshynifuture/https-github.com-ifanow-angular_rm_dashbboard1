import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdviceActionComponent } from './advice-action.component';

describe('AdviceActionComponent', () => {
  let component: AdviceActionComponent;
  let fixture: ComponentFixture<AdviceActionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdviceActionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdviceActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
