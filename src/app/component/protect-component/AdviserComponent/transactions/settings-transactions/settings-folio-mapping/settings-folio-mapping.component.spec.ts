import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SettingsFolioMappingComponent } from './settings-folio-mapping.component';

describe('SettingsFolioMappingComponent', () => {
  let component: SettingsFolioMappingComponent;
  let fixture: ComponentFixture<SettingsFolioMappingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SettingsFolioMappingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SettingsFolioMappingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
