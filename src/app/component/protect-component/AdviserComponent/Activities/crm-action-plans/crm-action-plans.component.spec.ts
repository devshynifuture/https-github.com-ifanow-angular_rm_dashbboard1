import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CrmActionPlansComponent } from './crm-action-plans.component';

describe('CrmActionPlansComponent', () => {
  let component: CrmActionPlansComponent;
  let fixture: ComponentFixture<CrmActionPlansComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CrmActionPlansComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CrmActionPlansComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
