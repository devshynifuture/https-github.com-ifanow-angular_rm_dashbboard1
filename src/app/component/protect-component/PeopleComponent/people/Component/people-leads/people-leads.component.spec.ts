import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PeopleLeadsComponent } from './people-leads.component';

describe('PeopleLeadsComponent', () => {
  let component: PeopleLeadsComponent;
  let fixture: ComponentFixture<PeopleLeadsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PeopleLeadsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PeopleLeadsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
