import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MfCapitalDetailedComponent } from './mf-capital-detailed.component';

describe('MfCapitalDetailedComponent', () => {
  let component: MfCapitalDetailedComponent;
  let fixture: ComponentFixture<MfCapitalDetailedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MfCapitalDetailedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MfCapitalDetailedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
