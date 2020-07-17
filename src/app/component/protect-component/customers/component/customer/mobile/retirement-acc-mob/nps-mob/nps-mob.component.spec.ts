import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NpsMobComponent } from './nps-mob.component';

describe('NpsMobComponent', () => {
  let component: NpsMobComponent;
  let fixture: ComponentFixture<NpsMobComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NpsMobComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NpsMobComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
