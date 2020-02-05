import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageExclusionsComponent } from './manage-exclusions.component';

describe('ManageExclusionsComponent', () => {
  let component: ManageExclusionsComponent;
  let fixture: ComponentFixture<ManageExclusionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManageExclusionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageExclusionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
