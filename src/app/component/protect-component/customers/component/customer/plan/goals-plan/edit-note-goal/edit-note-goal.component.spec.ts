import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditNoteGoalComponent } from './edit-note-goal.component';

describe('EditNoteGoalComponent', () => {
  let component: EditNoteGoalComponent;
  let fixture: ComponentFixture<EditNoteGoalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditNoteGoalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditNoteGoalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
