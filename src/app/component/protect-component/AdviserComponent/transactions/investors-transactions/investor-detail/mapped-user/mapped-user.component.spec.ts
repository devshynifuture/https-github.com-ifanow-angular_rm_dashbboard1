import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MappedUserComponent } from './mapped-user.component';

describe('MappedUserComponent', () => {
  let component: MappedUserComponent;
  let fixture: ComponentFixture<MappedUserComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MappedUserComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MappedUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
