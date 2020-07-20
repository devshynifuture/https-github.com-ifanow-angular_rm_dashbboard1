import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailedPoTdMobComponent } from './detailed-po-td-mob.component';

describe('DetailedPoTdMobComponent', () => {
  let component: DetailedPoTdMobComponent;
  let fixture: ComponentFixture<DetailedPoTdMobComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetailedPoTdMobComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailedPoTdMobComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
