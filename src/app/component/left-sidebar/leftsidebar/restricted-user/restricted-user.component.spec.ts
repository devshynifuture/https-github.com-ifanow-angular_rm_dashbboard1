import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RestrictedUserComponent } from './restricted-user.component';

describe('RestrictedUserComponent', () => {
  let component: RestrictedUserComponent;
  let fixture: ComponentFixture<RestrictedUserComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RestrictedUserComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RestrictedUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
