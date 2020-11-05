import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmailLeftSidebarComponent } from './email-left-sidebar.component';

describe('LeftSidebarComponent', () => {
  let component: EmailLeftSidebarComponent;
  let fixture: ComponentFixture<EmailLeftSidebarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [LeftSidebarComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LeftSidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
