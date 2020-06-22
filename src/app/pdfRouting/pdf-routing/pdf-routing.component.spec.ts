import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PdfRoutingComponent } from './pdf-routing.component';

describe('PdfRoutingComponent', () => {
  let component: PdfRoutingComponent;
  let fixture: ComponentFixture<PdfRoutingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PdfRoutingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PdfRoutingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
