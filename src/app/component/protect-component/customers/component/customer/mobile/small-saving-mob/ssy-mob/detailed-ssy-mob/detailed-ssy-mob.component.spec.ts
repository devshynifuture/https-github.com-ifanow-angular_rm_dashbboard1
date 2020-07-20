import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailedSsyMobComponent } from './detailed-ssy-mob.component';

describe('DetailedSsyMobComponent', () => {
  let component: DetailedSsyMobComponent;
  let fixture: ComponentFixture<DetailedSsyMobComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetailedSsyMobComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailedSsyMobComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
