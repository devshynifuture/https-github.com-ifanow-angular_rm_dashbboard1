import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SettingPlanComponent } from './setting-plan.component';

describe('SettingPlanComponent', () => {
  let component: SettingPlanComponent;
  let fixture: ComponentFixture<SettingPlanComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SettingPlanComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SettingPlanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
