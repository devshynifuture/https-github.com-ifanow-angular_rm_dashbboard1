import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddPersonalProfileComponent } from './add-personal-profile.component';

describe('AddPersonalProfileComponent', () => {
  let component: AddPersonalProfileComponent;
  let fixture: ComponentFixture<AddPersonalProfileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddPersonalProfileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddPersonalProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
