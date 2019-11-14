import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddSuperannuationComponent } from './add-superannuation.component';

describe('AddSuperannuationComponent', () => {
  let component: AddSuperannuationComponent;
  let fixture: ComponentFixture<AddSuperannuationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddSuperannuationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddSuperannuationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
