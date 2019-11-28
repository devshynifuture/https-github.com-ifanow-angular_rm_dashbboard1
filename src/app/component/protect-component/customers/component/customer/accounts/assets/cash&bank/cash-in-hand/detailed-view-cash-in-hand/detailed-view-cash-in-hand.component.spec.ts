import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailedViewCashInHandComponent } from './detailed-view-cash-in-hand.component';

describe('DetailedViewCashInHandComponent', () => {
  let component: DetailedViewCashInHandComponent;
  let fixture: ComponentFixture<DetailedViewCashInHandComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetailedViewCashInHandComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailedViewCashInHandComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
