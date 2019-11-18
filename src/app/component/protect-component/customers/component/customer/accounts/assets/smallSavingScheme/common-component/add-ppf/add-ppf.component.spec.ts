import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddPpfComponent } from './add-ppf.component';

describe('AddPpfComponent', () => {
  let component: AddPpfComponent;
  let fixture: ComponentFixture<AddPpfComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddPpfComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddPpfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
