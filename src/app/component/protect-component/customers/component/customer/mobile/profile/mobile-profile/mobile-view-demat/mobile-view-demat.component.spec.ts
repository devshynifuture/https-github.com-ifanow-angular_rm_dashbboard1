import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MobileViewDematComponent } from './mobile-view-demat.component';

describe('MobileViewDematComponent', () => {
  let component: MobileViewDematComponent;
  let fixture: ComponentFixture<MobileViewDematComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MobileViewDematComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MobileViewDematComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
