import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailedViewBankAccountComponent } from './detailed-view-bank-account.component';

describe('DetailedViewBankAccountComponent', () => {
  let component: DetailedViewBankAccountComponent;
  let fixture: ComponentFixture<DetailedViewBankAccountComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetailedViewBankAccountComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailedViewBankAccountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
