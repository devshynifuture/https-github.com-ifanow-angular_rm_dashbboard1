import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailedViewGoldMobComponent } from './detailed-view-gold-mob.component';

describe('DetailedViewGoldMobComponent', () => {
  let component: DetailedViewGoldMobComponent;
  let fixture: ComponentFixture<DetailedViewGoldMobComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetailedViewGoldMobComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailedViewGoldMobComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
