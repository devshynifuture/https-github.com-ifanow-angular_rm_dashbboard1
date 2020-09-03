import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditPercentComponent } from './edit-percent.component';

describe('EditPercentComponent', () => {
  let component: EditPercentComponent;
  let fixture: ComponentFixture<EditPercentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditPercentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditPercentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
