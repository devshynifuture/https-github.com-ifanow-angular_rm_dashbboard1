import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BackDetailsComponent } from './back-details.component';

describe('BackDetailsComponent', () => {
  let component: BackDetailsComponent;
  let fixture: ComponentFixture<BackDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BackDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BackDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
