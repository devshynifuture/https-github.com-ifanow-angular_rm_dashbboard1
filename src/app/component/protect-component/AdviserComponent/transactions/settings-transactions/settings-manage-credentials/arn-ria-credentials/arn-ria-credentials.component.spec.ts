import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ArnRiaCredentialsComponent } from './arn-ria-credentials.component';

describe('ArnRiaCredentialsComponent', () => {
  let component: ArnRiaCredentialsComponent;
  let fixture: ComponentFixture<ArnRiaCredentialsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ArnRiaCredentialsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ArnRiaCredentialsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
