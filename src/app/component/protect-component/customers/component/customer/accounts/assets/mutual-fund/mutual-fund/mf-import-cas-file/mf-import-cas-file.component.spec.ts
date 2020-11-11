import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MfImportCasFileComponent } from './mf-import-cas-file.component';

describe('MfImportCasFileComponent', () => {
  let component: MfImportCasFileComponent;
  let fixture: ComponentFixture<MfImportCasFileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MfImportCasFileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MfImportCasFileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
