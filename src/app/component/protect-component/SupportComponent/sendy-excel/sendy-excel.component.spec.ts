import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SendyExcelComponent } from './sendy-excel.component';

describe('SendyExcelComponent', () => {
  let component: SendyExcelComponent;
  let fixture: ComponentFixture<SendyExcelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SendyExcelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SendyExcelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
