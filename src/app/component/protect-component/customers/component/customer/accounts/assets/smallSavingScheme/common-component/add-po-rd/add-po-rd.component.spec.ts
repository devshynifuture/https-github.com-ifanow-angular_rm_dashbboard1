import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddPoRdComponent } from './add-po-rd.component';

describe('AddPoRdComponent', () => {
  let component: AddPoRdComponent;
  let fixture: ComponentFixture<AddPoRdComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddPoRdComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddPoRdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
