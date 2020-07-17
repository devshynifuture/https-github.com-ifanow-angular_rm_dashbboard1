import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddPersonalAccidentMobComponent } from './add-personal-accident-mob.component';

describe('AddPersonalAccidentMobComponent', () => {
  let component: AddPersonalAccidentMobComponent;
  let fixture: ComponentFixture<AddPersonalAccidentMobComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddPersonalAccidentMobComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddPersonalAccidentMobComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
