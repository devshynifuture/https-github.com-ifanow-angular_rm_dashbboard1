import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditApplicableTaxComponent } from './edit-applicable-tax.component';

describe('EditApplicableTaxComponent', () => {
  let component: EditApplicableTaxComponent;
  let fixture: ComponentFixture<EditApplicableTaxComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditApplicableTaxComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditApplicableTaxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
