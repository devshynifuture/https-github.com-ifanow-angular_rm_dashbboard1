import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddKarvyDetailsComponent } from './add-karvy-details.component';

describe('AddKarvyDetailsComponent', () => {
  let component: AddKarvyDetailsComponent;
  let fixture: ComponentFixture<AddKarvyDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddKarvyDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddKarvyDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
