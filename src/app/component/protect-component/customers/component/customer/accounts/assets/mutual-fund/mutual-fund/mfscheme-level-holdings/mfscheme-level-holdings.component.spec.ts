import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MFSchemeLevelHoldingsComponent } from './mfscheme-level-holdings.component';

describe('MFSchemeLevelHoldingsComponent', () => {
  let component: MFSchemeLevelHoldingsComponent;
  let fixture: ComponentFixture<MFSchemeLevelHoldingsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MFSchemeLevelHoldingsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MFSchemeLevelHoldingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
