import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddDeploymentsComponent } from './add-deployments.component';

describe('AddDeploymentsComponent', () => {
  let component: AddDeploymentsComponent;
  let fixture: ComponentFixture<AddDeploymentsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddDeploymentsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddDeploymentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
