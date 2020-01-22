import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BackofficeMisComponent } from './backoffice-mis.component';

describe('BackofficeMisComponent', () => {
  let component: BackofficeMisComponent;
  let fixture: ComponentFixture<BackofficeMisComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BackofficeMisComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BackofficeMisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
