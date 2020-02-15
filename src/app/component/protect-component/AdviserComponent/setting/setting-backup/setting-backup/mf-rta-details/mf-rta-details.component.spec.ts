import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MfRtaDetailsComponent } from './mf-rta-details.component';

describe('MfRtaDetailsComponent', () => {
  let component: MfRtaDetailsComponent;
  let fixture: ComponentFixture<MfRtaDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MfRtaDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MfRtaDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
