import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddIncomeFamilyMemberComponent } from './add-income-family-member.component';

describe('AddIncomeFamilyMemberComponent', () => {
  let component: AddIncomeFamilyMemberComponent;
  let fixture: ComponentFixture<AddIncomeFamilyMemberComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddIncomeFamilyMemberComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddIncomeFamilyMemberComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
