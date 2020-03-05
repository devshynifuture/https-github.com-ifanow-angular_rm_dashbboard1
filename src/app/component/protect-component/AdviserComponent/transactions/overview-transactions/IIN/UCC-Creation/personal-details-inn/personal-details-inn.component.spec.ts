import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonalDetailsInnComponent } from './personal-details-inn.component';

describe('PersonalDetailsInnComponent', () => {
  let component: PersonalDetailsInnComponent;
  let fixture: ComponentFixture<PersonalDetailsInnComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PersonalDetailsInnComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PersonalDetailsInnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
