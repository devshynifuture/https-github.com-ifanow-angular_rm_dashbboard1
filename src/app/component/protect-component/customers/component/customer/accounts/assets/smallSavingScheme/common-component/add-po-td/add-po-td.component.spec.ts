import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddPoTdComponent } from './add-po-td.component';

describe('AddPoTdComponent', () => {
  let component: AddPoTdComponent;
  let fixture: ComponentFixture<AddPoTdComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddPoTdComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddPoTdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
