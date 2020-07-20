import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailedNscMobComponent } from './detailed-nsc-mob.component';

describe('DetailedNscMobComponent', () => {
  let component: DetailedNscMobComponent;
  let fixture: ComponentFixture<DetailedNscMobComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetailedNscMobComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailedNscMobComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
