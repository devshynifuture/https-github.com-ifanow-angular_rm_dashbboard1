import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmailArchiveComponent } from './email-archive.component';

describe('EmailArchiveComponent', () => {
  let component: EmailArchiveComponent;
  let fixture: ComponentFixture<EmailArchiveComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmailArchiveComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmailArchiveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
