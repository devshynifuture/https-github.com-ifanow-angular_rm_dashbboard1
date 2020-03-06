import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LeftKycListComponent } from './left-kyc-list.component';

describe('LeftKycListComponent', () => {
  let component: LeftKycListComponent;
  let fixture: ComponentFixture<LeftKycListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LeftKycListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LeftKycListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
