import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddKvpComponent } from './add-kvp.component';

describe('AddKvpComponent', () => {
  let component: AddKvpComponent;
  let fixture: ComponentFixture<AddKvpComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddKvpComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddKvpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
