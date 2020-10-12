import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmailRefersComponent } from './email-refers.component';

describe('EmailRefersComponent', () => {
  let component: EmailRefersComponent;
  let fixture: ComponentFixture<EmailRefersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmailRefersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmailRefersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
