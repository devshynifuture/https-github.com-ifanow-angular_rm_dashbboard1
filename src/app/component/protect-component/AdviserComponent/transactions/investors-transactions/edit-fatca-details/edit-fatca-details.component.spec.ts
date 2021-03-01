import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditFatcaDetailsComponent } from './edit-fatca-details.component';

describe('EditFatcaDetailsComponent', () => {
  let component: EditFatcaDetailsComponent;
  let fixture: ComponentFixture<EditFatcaDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditFatcaDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditFatcaDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
