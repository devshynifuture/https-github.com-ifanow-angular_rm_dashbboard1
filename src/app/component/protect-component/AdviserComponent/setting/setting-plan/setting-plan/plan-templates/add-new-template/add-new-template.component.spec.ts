import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddNewTemplateComponent } from './add-new-template.component';

describe('AddNewTemplateComponent', () => {
  let component: AddNewTemplateComponent;
  let fixture: ComponentFixture<AddNewTemplateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddNewTemplateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddNewTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
