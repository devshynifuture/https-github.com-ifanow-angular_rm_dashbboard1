import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddArnRiaCredentialsComponent } from './add-arn-ria-credentials.component';

describe('AddArnRiaCredentialsComponent', () => {
  let component: AddArnRiaCredentialsComponent;
  let fixture: ComponentFixture<AddArnRiaCredentialsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddArnRiaCredentialsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddArnRiaCredentialsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
