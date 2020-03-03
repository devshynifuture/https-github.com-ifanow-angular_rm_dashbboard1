import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowHealthPlanningComponent } from './show-health-planning.component';

describe('ShowHealthPlanningComponent', () => {
  let component: ShowHealthPlanningComponent;
  let fixture: ComponentFixture<ShowHealthPlanningComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShowHealthPlanningComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowHealthPlanningComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
