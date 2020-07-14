import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MobileViewBankComponent } from './mobile-view-bank.component';

describe('MobileViewBankComponent', () => {
  let component: MobileViewBankComponent;
  let fixture: ComponentFixture<MobileViewBankComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MobileViewBankComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MobileViewBankComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
