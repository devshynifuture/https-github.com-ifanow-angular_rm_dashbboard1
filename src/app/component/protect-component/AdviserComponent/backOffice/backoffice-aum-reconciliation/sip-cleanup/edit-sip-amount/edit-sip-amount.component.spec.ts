import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditSipAmountComponent } from './edit-sip-amount.component';

describe('EditSipAmountComponent', () => {
  let component: EditSipAmountComponent;
  let fixture: ComponentFixture<EditSipAmountComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditSipAmountComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditSipAmountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
