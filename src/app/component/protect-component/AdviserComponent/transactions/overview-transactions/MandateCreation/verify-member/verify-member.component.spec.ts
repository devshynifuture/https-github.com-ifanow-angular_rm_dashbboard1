import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VerifyMemberComponent } from './verify-member.component';

describe('VerifyMemberComponent', () => {
  let component: VerifyMemberComponent;
  let fixture: ComponentFixture<VerifyMemberComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VerifyMemberComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VerifyMemberComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
