import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UnmapPopupComponent } from './unmap-popup.component';

describe('UnmapPopupComponent', () => {
  let component: UnmapPopupComponent;
  let fixture: ComponentFixture<UnmapPopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UnmapPopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UnmapPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
