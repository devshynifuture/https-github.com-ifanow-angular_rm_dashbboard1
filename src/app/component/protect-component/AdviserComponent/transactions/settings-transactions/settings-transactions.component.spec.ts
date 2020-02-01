import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SettingsTransactionsComponent } from './settings-transactions.component';

describe('SettingsTransactionsComponent', () => {
  let component: SettingsTransactionsComponent;
  let fixture: ComponentFixture<SettingsTransactionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SettingsTransactionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SettingsTransactionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
