import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SmallSavingSchemeComponent } from './small-saving-scheme.component';

describe('SmallSavingSchemeComponent', () => {
  let component: SmallSavingSchemeComponent;
  let fixture: ComponentFixture<SmallSavingSchemeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SmallSavingSchemeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SmallSavingSchemeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
