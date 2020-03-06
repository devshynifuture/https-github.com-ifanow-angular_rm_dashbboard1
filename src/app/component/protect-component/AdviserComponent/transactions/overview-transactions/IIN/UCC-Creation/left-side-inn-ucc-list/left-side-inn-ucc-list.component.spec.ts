import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LeftSideInnUccListComponent } from './left-side-inn-ucc-list.component';

describe('LeftSideInnUccListComponent', () => {
  let component: LeftSideInnUccListComponent;
  let fixture: ComponentFixture<LeftSideInnUccListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LeftSideInnUccListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LeftSideInnUccListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
