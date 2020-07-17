import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PoRdMobComponent } from './po-rd-mob.component';

describe('PoRdMobComponent', () => {
  let component: PoRdMobComponent;
  let fixture: ComponentFixture<PoRdMobComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PoRdMobComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PoRdMobComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
