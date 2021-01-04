import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RunSipMappingMasterComponent } from './run-sip-mapping-master.component';

describe('RunSipMappingMasterComponent', () => {
  let component: RunSipMappingMasterComponent;
  let fixture: ComponentFixture<RunSipMappingMasterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RunSipMappingMasterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RunSipMappingMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
