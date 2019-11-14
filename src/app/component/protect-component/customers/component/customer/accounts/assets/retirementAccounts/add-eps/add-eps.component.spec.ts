import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEPSComponent } from './add-eps.component';

describe('AddEPSComponent', () => {
  let component: AddEPSComponent;
  let fixture: ComponentFixture<AddEPSComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddEPSComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddEPSComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
