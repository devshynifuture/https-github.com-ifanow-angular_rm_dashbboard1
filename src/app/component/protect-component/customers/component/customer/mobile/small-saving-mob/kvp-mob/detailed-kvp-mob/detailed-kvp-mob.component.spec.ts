import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailedKvpMobComponent } from './detailed-kvp-mob.component';

describe('DetailedKvpMobComponent', () => {
  let component: DetailedKvpMobComponent;
  let fixture: ComponentFixture<DetailedKvpMobComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetailedKvpMobComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailedKvpMobComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
