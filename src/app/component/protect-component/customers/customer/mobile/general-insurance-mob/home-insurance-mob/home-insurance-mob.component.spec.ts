import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeInsuranceMobComponent } from './home-insurance-mob.component';

describe('HomeInsuranceMobComponent', () => {
  let component: HomeInsuranceMobComponent;
  let fixture: ComponentFixture<HomeInsuranceMobComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HomeInsuranceMobComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeInsuranceMobComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
