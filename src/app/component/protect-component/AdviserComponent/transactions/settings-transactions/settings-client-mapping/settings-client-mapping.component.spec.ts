import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SettingsClientMappingComponent } from './settings-client-mapping.component';

describe('SettingsClientMappingComponent', () => {
  let component: SettingsClientMappingComponent;
  let fixture: ComponentFixture<SettingsClientMappingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SettingsClientMappingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SettingsClientMappingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
