import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlatformPopUpComponent } from './platform-pop-up.component';

describe('PlatformPopUpComponent', () => {
  let component: PlatformPopUpComponent;
  let fixture: ComponentFixture<PlatformPopUpComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlatformPopUpComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlatformPopUpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
