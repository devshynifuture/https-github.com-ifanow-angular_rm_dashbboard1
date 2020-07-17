import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CriticalIllnesMobComponent } from './critical-illnes-mob.component';

describe('CriticalIllnesMobComponent', () => {
  let component: CriticalIllnesMobComponent;
  let fixture: ComponentFixture<CriticalIllnesMobComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CriticalIllnesMobComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CriticalIllnesMobComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
