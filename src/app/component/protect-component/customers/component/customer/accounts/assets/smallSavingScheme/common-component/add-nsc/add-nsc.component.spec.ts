import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddNscComponent } from './add-nsc.component';

describe('AddNscComponent', () => {
  let component: AddNscComponent;
  let fixture: ComponentFixture<AddNscComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddNscComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddNscComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
