import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EpfMobComponent } from './epf-mob.component';

describe('EpfMobComponent', () => {
  let component: EpfMobComponent;
  let fixture: ComponentFixture<EpfMobComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EpfMobComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EpfMobComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
