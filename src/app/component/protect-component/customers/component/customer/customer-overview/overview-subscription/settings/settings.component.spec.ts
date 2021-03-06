import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientSettingsComponent } from './settings.component';

describe('SettingsComponent', () => {
  let component: ClientSettingsComponent;
  let fixture: ComponentFixture<ClientSettingsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClientSettingsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
