import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FeviconUrlComponent } from './fevicon-url.component';

describe('FeviconUrlComponent', () => {
  let component: FeviconUrlComponent;
  let fixture: ComponentFixture<FeviconUrlComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FeviconUrlComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FeviconUrlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
