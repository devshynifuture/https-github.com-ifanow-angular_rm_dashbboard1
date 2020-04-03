import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddHolderNamesComponent } from './add-holder-names.component';

describe('AddHolderNamesComponent', () => {
  let component: AddHolderNamesComponent;
  let fixture: ComponentFixture<AddHolderNamesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddHolderNamesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddHolderNamesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
