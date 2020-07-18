import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailedViewBankAccMobComponent } from './detailed-view-bank-acc-mob.component';

describe('DetailedViewBankAccMobComponent', () => {
  let component: DetailedViewBankAccMobComponent;
  let fixture: ComponentFixture<DetailedViewBankAccMobComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetailedViewBankAccMobComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailedViewBankAccMobComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
