import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KvpMobComponent } from './kvp-mob.component';

describe('KvpMobComponent', () => {
  let component: KvpMobComponent;
  let fixture: ComponentFixture<KvpMobComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KvpMobComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KvpMobComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
