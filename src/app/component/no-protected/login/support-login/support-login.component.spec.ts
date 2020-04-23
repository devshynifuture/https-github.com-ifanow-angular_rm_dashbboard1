import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SupportLoginComponent } from './support-login.component';

describe('SupportLoginComponent', () => {
  let component: SupportLoginComponent;
  let fixture: ComponentFixture<SupportLoginComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SupportLoginComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SupportLoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
