import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddSsyComponent } from './add-ssy.component';

describe('AddSsyComponent', () => {
  let component: AddSsyComponent;
  let fixture: ComponentFixture<AddSsyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddSsyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddSsyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
