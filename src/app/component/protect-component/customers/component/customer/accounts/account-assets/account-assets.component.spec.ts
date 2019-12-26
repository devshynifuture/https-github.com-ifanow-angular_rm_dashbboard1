import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountAssetsComponent } from './account-assets.component';

describe('AccountAssetsComponent', () => {
  let component: AccountAssetsComponent;
  let fixture: ComponentFixture<AccountAssetsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AccountAssetsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountAssetsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
