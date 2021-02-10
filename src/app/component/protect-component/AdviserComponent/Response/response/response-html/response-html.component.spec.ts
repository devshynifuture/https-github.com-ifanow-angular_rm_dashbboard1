import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResponseHtmlComponent } from './response-html.component';

describe('ResponseHtmlComponent', () => {
  let component: ResponseHtmlComponent;
  let fixture: ComponentFixture<ResponseHtmlComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ResponseHtmlComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResponseHtmlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
