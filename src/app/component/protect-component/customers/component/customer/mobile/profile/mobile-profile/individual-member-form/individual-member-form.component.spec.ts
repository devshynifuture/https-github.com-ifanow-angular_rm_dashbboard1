import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IndividualMemberFormComponent } from './individual-member-form.component';

describe('IndividualMemberFormComponent', () => {
  let component: IndividualMemberFormComponent;
  let fixture: ComponentFixture<IndividualMemberFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IndividualMemberFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IndividualMemberFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
