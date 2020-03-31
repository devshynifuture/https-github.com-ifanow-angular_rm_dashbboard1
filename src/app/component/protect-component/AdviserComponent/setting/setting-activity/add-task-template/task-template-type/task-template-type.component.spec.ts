import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskTemplateTypeComponent } from './task-template-type.component';

describe('TaskTemplateTypeComponent', () => {
  let component: TaskTemplateTypeComponent;
  let fixture: ComponentFixture<TaskTemplateTypeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TaskTemplateTypeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TaskTemplateTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
