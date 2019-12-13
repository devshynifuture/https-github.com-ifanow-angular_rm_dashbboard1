import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddSuggestPolicyComponent } from './add-suggest-policy.component';

describe('AddSuggestPolicyComponent', () => {
  let component: AddSuggestPolicyComponent;
  let fixture: ComponentFixture<AddSuggestPolicyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddSuggestPolicyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddSuggestPolicyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
