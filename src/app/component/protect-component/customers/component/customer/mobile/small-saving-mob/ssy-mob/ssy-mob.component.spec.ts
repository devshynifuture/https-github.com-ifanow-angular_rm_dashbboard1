import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SsyMobComponent } from './ssy-mob.component';

describe('SsyMobComponent', () => {
  let component: SsyMobComponent;
  let fixture: ComponentFixture<SsyMobComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SsyMobComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SsyMobComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
