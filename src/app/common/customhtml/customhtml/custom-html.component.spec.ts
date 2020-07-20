import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomHtmlComponent } from './custom-html.component';

describe('CustomhtmlComponent', () => {
  let component: CustomHtmlComponent;
  let fixture: ComponentFixture<CustomHtmlComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomHtmlComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomHtmlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
