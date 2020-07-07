import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MobileLeftSidenavComponent } from './mobile-left-sidenav.component';

describe('MobileLeftSidenavComponent', () => {
  let component: MobileLeftSidenavComponent;
  let fixture: ComponentFixture<MobileLeftSidenavComponent>;
 
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MobileLeftSidenavComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MobileLeftSidenavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
