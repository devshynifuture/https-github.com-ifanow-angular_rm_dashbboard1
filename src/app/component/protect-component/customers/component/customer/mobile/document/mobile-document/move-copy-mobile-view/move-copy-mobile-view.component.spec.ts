import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MoveCopyMobileViewComponent } from './move-copy-mobile-view.component';

describe('MoveCopyMobileViewComponent', () => {
  let component: MoveCopyMobileViewComponent;
  let fixture: ComponentFixture<MoveCopyMobileViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MoveCopyMobileViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MoveCopyMobileViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
