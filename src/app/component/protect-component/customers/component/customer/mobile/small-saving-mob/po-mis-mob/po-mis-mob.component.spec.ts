import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PoMisMobComponent } from './po-mis-mob.component';

describe('PoMisMobComponent', () => {
  let component: PoMisMobComponent;
  let fixture: ComponentFixture<PoMisMobComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PoMisMobComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PoMisMobComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
