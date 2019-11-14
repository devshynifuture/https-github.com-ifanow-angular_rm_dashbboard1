import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEPFComponent } from './add-epf.component';

describe('AddEPFComponent', () => {
  let component: AddEPFComponent;
  let fixture: ComponentFixture<AddEPFComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddEPFComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddEPFComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
