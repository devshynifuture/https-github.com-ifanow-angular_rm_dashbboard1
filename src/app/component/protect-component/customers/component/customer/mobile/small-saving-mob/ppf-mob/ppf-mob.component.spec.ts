import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PpfMobComponent } from './ppf-mob.component';

describe('PpfMobComponent', () => {
  let component: PpfMobComponent;
  let fixture: ComponentFixture<PpfMobComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PpfMobComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PpfMobComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
