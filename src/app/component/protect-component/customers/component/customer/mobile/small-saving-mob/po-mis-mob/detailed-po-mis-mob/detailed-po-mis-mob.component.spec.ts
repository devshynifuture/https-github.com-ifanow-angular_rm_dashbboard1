import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailedPoMisMobComponent } from './detailed-po-mis-mob.component';

describe('DetailedPoMisMobComponent', () => {
  let component: DetailedPoMisMobComponent;
  let fixture: ComponentFixture<DetailedPoMisMobComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetailedPoMisMobComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailedPoMisMobComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
