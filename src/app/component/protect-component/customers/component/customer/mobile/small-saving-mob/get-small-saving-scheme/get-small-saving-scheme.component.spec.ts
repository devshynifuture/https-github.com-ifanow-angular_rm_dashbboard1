import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GetSmallSavingSchemeComponent } from './get-small-saving-scheme.component';

describe('GetSmallSavingSchemeComponent', () => {
  let component: GetSmallSavingSchemeComponent;
  let fixture: ComponentFixture<GetSmallSavingSchemeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GetSmallSavingSchemeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GetSmallSavingSchemeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
