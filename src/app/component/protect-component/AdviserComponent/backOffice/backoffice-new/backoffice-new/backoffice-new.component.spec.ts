import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BackofficeNewComponent } from './backoffice-new.component';

describe('BackofficeNewComponent', () => {
  let component: BackofficeNewComponent;
  let fixture: ComponentFixture<BackofficeNewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BackofficeNewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BackofficeNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
