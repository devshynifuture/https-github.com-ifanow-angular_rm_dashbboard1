import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NscMobComponent } from './nsc-mob.component';

describe('NscMobComponent', () => {
  let component: NscMobComponent;
  let fixture: ComponentFixture<NscMobComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NscMobComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NscMobComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
