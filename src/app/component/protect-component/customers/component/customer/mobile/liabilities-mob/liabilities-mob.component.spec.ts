import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LiabilitiesMobComponent } from './liabilities-mob.component';

describe('LiabilitiesMobComponent', () => {
  let component: LiabilitiesMobComponent;
  let fixture: ComponentFixture<LiabilitiesMobComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LiabilitiesMobComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LiabilitiesMobComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
