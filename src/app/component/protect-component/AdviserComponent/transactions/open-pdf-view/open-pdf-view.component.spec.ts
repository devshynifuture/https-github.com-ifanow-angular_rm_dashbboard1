import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OpenPdfViewComponent } from './open-pdf-view.component';

describe('OpenPdfViewComponent', () => {
  let component: OpenPdfViewComponent;
  let fixture: ComponentFixture<OpenPdfViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OpenPdfViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OpenPdfViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
