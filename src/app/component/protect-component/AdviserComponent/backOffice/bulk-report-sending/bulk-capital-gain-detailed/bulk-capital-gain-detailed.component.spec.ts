import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BulkCapitalGainDetailedComponent } from './bulk-capital-gain-detailed.component';

describe('BulkCapitalGainDetailedComponent', () => {
  let component: BulkCapitalGainDetailedComponent;
  let fixture: ComponentFixture<BulkCapitalGainDetailedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BulkCapitalGainDetailedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BulkCapitalGainDetailedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
