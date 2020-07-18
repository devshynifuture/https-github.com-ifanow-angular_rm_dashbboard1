import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailedBondMobComponent } from './detailed-bond-mob.component';

describe('DetailedBondMobComponent', () => {
  let component: DetailedBondMobComponent;
  let fixture: ComponentFixture<DetailedBondMobComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetailedBondMobComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailedBondMobComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
