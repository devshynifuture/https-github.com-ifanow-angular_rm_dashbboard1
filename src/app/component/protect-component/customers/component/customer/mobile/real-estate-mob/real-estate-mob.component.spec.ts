import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RealEstateMobComponent } from './real-estate-mob.component';

describe('RealEstateMobComponent', () => {
  let component: RealEstateMobComponent;
  let fixture: ComponentFixture<RealEstateMobComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RealEstateMobComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RealEstateMobComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
