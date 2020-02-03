import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddSubBrokerCredentialsComponent } from './add-sub-broker-credentials.component';

describe('AddSubBrokerCredentialsComponent', () => {
  let component: AddSubBrokerCredentialsComponent;
  let fixture: ComponentFixture<AddSubBrokerCredentialsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddSubBrokerCredentialsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddSubBrokerCredentialsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
