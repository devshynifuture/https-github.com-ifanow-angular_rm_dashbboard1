import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GetRetirementMobComponent } from './get-retirement-mob.component';

describe('GetRetirementMobComponent', () => {
  let component: GetRetirementMobComponent;
  let fixture: ComponentFixture<GetRetirementMobComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GetRetirementMobComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GetRetirementMobComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
