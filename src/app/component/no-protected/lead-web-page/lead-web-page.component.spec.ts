import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LeadWebPageComponent } from './lead-web-page.component';

describe('LeadWebPageComponent', () => {
  let component: LeadWebPageComponent;
  let fixture: ComponentFixture<LeadWebPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LeadWebPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LeadWebPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
