import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewReleaseNoteComponent } from './new-release-note.component';

describe('NewReleaseNoteComponent', () => {
  let component: NewReleaseNoteComponent;
  let fixture: ComponentFixture<NewReleaseNoteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewReleaseNoteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewReleaseNoteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
