import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddSettingSchemeBasketComponent } from './add-setting-scheme-basket.component';

describe('AddSettingSchemeBasketComponent', () => {
  let component: AddSettingSchemeBasketComponent;
  let fixture: ComponentFixture<AddSettingSchemeBasketComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddSettingSchemeBasketComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddSettingSchemeBasketComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
