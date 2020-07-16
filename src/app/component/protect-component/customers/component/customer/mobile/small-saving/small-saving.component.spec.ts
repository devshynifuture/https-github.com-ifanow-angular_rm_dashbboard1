import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SmallSavingComponent } from './small-saving.component';

describe('SmallSavingComponent', () => {
  let component: SmallSavingComponent;
  let fixture: ComponentFixture<SmallSavingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SmallSavingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SmallSavingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
