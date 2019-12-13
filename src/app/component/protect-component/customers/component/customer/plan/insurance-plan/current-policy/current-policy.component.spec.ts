import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CurrentPolicyComponent } from './current-policy.component';

describe('CurrentPolicyComponent', () => {
  let component: CurrentPolicyComponent;
  let fixture: ComponentFixture<CurrentPolicyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CurrentPolicyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CurrentPolicyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
