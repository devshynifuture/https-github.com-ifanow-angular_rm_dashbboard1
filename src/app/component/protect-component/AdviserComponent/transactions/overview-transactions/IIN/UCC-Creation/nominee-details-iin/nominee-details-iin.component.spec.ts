import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NomineeDetailsIinComponent } from './nominee-details-iin.component';

describe('NomineeDetailsIinComponent', () => {
  let component: NomineeDetailsIinComponent;
  let fixture: ComponentFixture<NomineeDetailsIinComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NomineeDetailsIinComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NomineeDetailsIinComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
