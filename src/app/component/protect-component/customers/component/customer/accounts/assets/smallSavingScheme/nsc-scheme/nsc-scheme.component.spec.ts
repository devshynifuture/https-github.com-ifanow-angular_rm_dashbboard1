import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NscSchemeComponent } from './nsc-scheme.component';

describe('NscSchemeComponent', () => {
  let component: NscSchemeComponent;
  let fixture: ComponentFixture<NscSchemeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NscSchemeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NscSchemeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
