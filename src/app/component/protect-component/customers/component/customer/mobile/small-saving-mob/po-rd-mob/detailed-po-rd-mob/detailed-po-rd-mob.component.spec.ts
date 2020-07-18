import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailedPoRdMobComponent } from './detailed-po-rd-mob.component';

describe('DetailedPoRdMobComponent', () => {
  let component: DetailedPoRdMobComponent;
  let fixture: ComponentFixture<DetailedPoRdMobComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetailedPoRdMobComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailedPoRdMobComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
