import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SaveFinPlanSectionComponent } from './save-fin-plan-section.component';

describe('SaveFinPlanSectionComponent', () => {
  let component: SaveFinPlanSectionComponent;
  let fixture: ComponentFixture<SaveFinPlanSectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SaveFinPlanSectionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SaveFinPlanSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
