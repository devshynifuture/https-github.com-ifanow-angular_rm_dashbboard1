import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CrmTasksComponent } from './crm-tasks.component';

describe('CrmTasksComponent', () => {
  let component: CrmTasksComponent;
  let fixture: ComponentFixture<CrmTasksComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CrmTasksComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CrmTasksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
