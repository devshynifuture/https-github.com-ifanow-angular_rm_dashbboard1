import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddCamsFundsnetComponent } from './add-cams-fundsnet.component';

describe('AddCamsFundsnetComponent', () => {
  let component: AddCamsFundsnetComponent;
  let fixture: ComponentFixture<AddCamsFundsnetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddCamsFundsnetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddCamsFundsnetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
