import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmailAddTaskComponent } from './email-add-task.component';

describe('EmailAddTaskComponent', () => {
  let component: EmailAddTaskComponent;
  let fixture: ComponentFixture<EmailAddTaskComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [EmailAddTaskComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmailAddTaskComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
