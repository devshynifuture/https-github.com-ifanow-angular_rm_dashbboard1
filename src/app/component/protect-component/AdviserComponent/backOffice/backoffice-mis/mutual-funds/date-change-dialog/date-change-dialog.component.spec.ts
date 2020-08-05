import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DateChangeDialogComponent } from './date-change-dialog.component';

describe('DateChangeDialogComponent', () => {
  let component: DateChangeDialogComponent;
  let fixture: ComponentFixture<DateChangeDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DateChangeDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DateChangeDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
