import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MobileViewMoreInfoComponent } from './mobile-view-more-info.component';

describe('MobileViewMoreInfoComponent', () => {
  let component: MobileViewMoreInfoComponent;
  let fixture: ComponentFixture<MobileViewMoreInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MobileViewMoreInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MobileViewMoreInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
