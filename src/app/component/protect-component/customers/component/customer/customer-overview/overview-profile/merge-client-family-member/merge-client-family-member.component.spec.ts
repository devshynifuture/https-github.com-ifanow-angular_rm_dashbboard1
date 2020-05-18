import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {MergeClientFamilyMemberComponent} from './merge-client-family-member.component';

describe('MergeClientFamilyMemberComponent', () => {
  let component: MergeClientFamilyMemberComponent;
  let fixture: ComponentFixture<MergeClientFamilyMemberComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MergeClientFamilyMemberComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MergeClientFamilyMemberComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
