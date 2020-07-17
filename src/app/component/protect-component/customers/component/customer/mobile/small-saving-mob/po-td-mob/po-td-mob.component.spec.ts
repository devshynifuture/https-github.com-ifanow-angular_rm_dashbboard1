import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PoTdMobComponent } from './po-td-mob.component';

describe('PoTdMobComponent', () => {
  let component: PoTdMobComponent;
  let fixture: ComponentFixture<PoTdMobComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PoTdMobComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PoTdMobComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
