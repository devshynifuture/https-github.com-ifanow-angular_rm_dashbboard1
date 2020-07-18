import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailedNpsMobComponent } from './detailed-nps-mob.component';

describe('DetailedNpsMobComponent', () => {
  let component: DetailedNpsMobComponent;
  let fixture: ComponentFixture<DetailedNpsMobComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetailedNpsMobComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailedNpsMobComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
