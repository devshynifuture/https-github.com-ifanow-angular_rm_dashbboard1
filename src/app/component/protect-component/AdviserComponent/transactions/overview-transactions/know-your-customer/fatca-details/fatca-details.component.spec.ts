import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FatcaDetailsComponent } from './fatca-details.component';

describe('FatcaDetailsComponent', () => {
  let component: FatcaDetailsComponent;
  let fixture: ComponentFixture<FatcaDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FatcaDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FatcaDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
