import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OpenUrlsComponent } from './open-urls.component';

describe('OpenUrlsComponent', () => {
  let component: OpenUrlsComponent;
  let fixture: ComponentFixture<OpenUrlsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OpenUrlsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OpenUrlsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
