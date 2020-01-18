import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {AddPlanDetailComponent} from './add-plan-detail.component';

describe('AddStructureComponent', () => {
  let component: AddPlanDetailComponent;
  let fixture: ComponentFixture<AddPlanDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AddPlanDetailComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddPlanDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
