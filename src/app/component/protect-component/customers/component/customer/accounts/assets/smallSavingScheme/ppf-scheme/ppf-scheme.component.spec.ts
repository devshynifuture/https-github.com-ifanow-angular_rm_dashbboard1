import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PPFSchemeComponent } from './ppf-scheme.component';

describe('PPFSchemeComponent', () => {
  let component: PPFSchemeComponent;
  let fixture: ComponentFixture<PPFSchemeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PPFSchemeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PPFSchemeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
