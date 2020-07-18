import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailedViewCashInHandMobComponent } from './detailed-view-cash-in-hand-mob.component';

describe('DetailedViewCashInHandMobComponent', () => {
  let component: DetailedViewCashInHandMobComponent;
  let fixture: ComponentFixture<DetailedViewCashInHandMobComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetailedViewCashInHandMobComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailedViewCashInHandMobComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
