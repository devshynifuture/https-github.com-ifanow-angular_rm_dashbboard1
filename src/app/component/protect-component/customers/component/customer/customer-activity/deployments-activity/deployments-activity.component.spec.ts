import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeploymentsActivityComponent } from './deployments-activity.component';

describe('DeploymentsActivityComponent', () => {
  let component: DeploymentsActivityComponent;
  let fixture: ComponentFixture<DeploymentsActivityComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeploymentsActivityComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeploymentsActivityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
