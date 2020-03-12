import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FatcaDetailsInnComponent } from './fatca-details-inn.component';

describe('FatcaDetailsInnComponent', () => {
  let component: FatcaDetailsInnComponent;
  let fixture: ComponentFixture<FatcaDetailsInnComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FatcaDetailsInnComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FatcaDetailsInnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
