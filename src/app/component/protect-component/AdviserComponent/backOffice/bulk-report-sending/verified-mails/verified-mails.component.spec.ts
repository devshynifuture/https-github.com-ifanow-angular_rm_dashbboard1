import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VerifiedMailsComponent } from './verified-mails.component';

describe('VerifiedMailsComponent', () => {
  let component: VerifiedMailsComponent;
  let fixture: ComponentFixture<VerifiedMailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VerifiedMailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VerifiedMailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
