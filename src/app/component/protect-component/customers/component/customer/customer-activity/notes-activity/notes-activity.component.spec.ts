import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NotesActivityComponent } from './notes-activity.component';

describe('NotesActivityComponent', () => {
  let component: NotesActivityComponent;
  let fixture: ComponentFixture<NotesActivityComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NotesActivityComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NotesActivityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
