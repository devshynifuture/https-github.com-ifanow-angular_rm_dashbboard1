import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ScssMobComponent } from './scss-mob.component';

describe('ScssMobComponent', () => {
  let component: ScssMobComponent;
  let fixture: ComponentFixture<ScssMobComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ScssMobComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ScssMobComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
