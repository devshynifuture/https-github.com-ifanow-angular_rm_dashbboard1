import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientUploadComponent } from './client-upload.component';

describe('ClientUploadComponent', () => {
  let component: ClientUploadComponent;
  let fixture: ComponentFixture<ClientUploadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClientUploadComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
