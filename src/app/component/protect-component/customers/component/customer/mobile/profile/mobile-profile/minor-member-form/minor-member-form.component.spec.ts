import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MinorMemberFormComponent } from './minor-member-form.component';

describe('MinorMemberFormComponent', () => {
  let component: MinorMemberFormComponent;
  let fixture: ComponentFixture<MinorMemberFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MinorMemberFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MinorMemberFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
