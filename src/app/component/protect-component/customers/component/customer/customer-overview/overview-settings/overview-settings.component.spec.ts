import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OverviewSettingsComponent } from './overview-settings.component';

describe('OverviewSettingsComponent', () => {
  let component: OverviewSettingsComponent;
  let fixture: ComponentFixture<OverviewSettingsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OverviewSettingsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OverviewSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
