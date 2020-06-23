import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GoogleConnectDialogComponent } from './google-connect-dialog.component';

describe('GoogleConnectDialogComponent', () => {
  let component: GoogleConnectDialogComponent;
  let fixture: ComponentFixture<GoogleConnectDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GoogleConnectDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GoogleConnectDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
