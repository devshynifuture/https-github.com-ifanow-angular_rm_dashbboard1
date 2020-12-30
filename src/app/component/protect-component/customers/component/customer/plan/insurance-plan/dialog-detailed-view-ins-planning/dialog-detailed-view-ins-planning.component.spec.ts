import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogDetailedViewInsPlanningComponent } from './dialog-detailed-view-ins-planning.component';

describe('DialogDetailedViewInsPlanningComponent', () => {
  let component: DialogDetailedViewInsPlanningComponent;
  let fixture: ComponentFixture<DialogDetailedViewInsPlanningComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogDetailedViewInsPlanningComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogDetailedViewInsPlanningComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
