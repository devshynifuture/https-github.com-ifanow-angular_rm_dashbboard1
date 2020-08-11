import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VerifyAddEmailComponent } from './verify-add-email.component';

describe('VerifyAddEmailComponent', () => {
  let component: VerifyAddEmailComponent;
  let fixture: ComponentFixture<VerifyAddEmailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VerifyAddEmailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VerifyAddEmailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
