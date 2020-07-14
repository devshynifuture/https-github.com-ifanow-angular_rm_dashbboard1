import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditDematMobileViewComponent } from './add-edit-demat-mobile-view.component';

describe('AddEditDematMobileViewComponent', () => {
  let component: AddEditDematMobileViewComponent;
  let fixture: ComponentFixture<AddEditDematMobileViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddEditDematMobileViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddEditDematMobileViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
