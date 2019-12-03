import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmailComponentComponent } from './email-component.component';

describe('EmailComponentComponent', () => {
  let component: EmailComponentComponent;
  let fixture: ComponentFixture<EmailComponentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmailComponentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmailComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
