import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdviceActivityComponent } from './advice-activity.component';

describe('AdviceActivityComponent', () => {
  let component: AdviceActivityComponent;
  let fixture: ComponentFixture<AdviceActivityComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdviceActivityComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdviceActivityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
