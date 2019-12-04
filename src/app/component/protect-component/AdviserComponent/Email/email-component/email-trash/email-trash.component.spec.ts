import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmailTrashComponent } from './email-trash.component';

describe('EmailTrashComponent', () => {
  let component: EmailTrashComponent;
  let fixture: ComponentFixture<EmailTrashComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmailTrashComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmailTrashComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
