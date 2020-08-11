import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AlertTitleComponent } from './alert-title.component';

describe('AlertTitleComponent', () => {
  let component: AlertTitleComponent;
  let fixture: ComponentFixture<AlertTitleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AlertTitleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AlertTitleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
