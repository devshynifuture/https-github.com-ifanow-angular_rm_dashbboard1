import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HolderNameMobileViewComponent } from './holder-name-mobile-view.component';

describe('HolderNameMobileViewComponent', () => {
  let component: HolderNameMobileViewComponent;
  let fixture: ComponentFixture<HolderNameMobileViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HolderNameMobileViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HolderNameMobileViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
