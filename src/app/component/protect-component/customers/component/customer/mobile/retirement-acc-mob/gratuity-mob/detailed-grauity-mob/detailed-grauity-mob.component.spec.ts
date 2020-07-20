import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailedGrauityMobComponent } from './detailed-grauity-mob.component';

describe('DetailedGrauityMobComponent', () => {
  let component: DetailedGrauityMobComponent;
  let fixture: ComponentFixture<DetailedGrauityMobComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetailedGrauityMobComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailedGrauityMobComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
