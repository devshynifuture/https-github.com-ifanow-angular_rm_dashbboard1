import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MobileDocumentComponent } from './mobile-document.component';

describe('MobileDocumentComponent', () => {
  let component: MobileDocumentComponent;
  let fixture: ComponentFixture<MobileDocumentComponent>; 

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MobileDocumentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MobileDocumentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
