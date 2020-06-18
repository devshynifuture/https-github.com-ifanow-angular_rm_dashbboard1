import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientInvociesComponent } from './invocies.component';

describe('InvociesComponent', () => {
  let component: ClientInvociesComponent;
  let fixture: ComponentFixture<ClientInvociesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClientInvociesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientInvociesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
