import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddPoMisComponent } from './add-po-mis.component';

describe('AddPoMisComponent', () => {
  let component: AddPoMisComponent;
  let fixture: ComponentFixture<AddPoMisComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddPoMisComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddPoMisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
