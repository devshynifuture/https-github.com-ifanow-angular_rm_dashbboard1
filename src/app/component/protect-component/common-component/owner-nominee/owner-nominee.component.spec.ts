import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OwnerNomineeComponent } from './owner-nominee.component';

describe('OwnerNomineeComponent', () => {
  let component: OwnerNomineeComponent;
  let fixture: ComponentFixture<OwnerNomineeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OwnerNomineeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OwnerNomineeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
