import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NpsSchemeHoldingComponent } from './nps-scheme-holding.component';

describe('NpsSchemeHoldingComponent', () => {
  let component: NpsSchemeHoldingComponent;
  let fixture: ComponentFixture<NpsSchemeHoldingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NpsSchemeHoldingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NpsSchemeHoldingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
