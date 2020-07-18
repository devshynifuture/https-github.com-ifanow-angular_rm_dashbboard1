import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailedEpfMobComponent } from './detailed-epf-mob.component';

describe('DetailedEpfMobComponent', () => {
  let component: DetailedEpfMobComponent;
  let fixture: ComponentFixture<DetailedEpfMobComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetailedEpfMobComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailedEpfMobComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
