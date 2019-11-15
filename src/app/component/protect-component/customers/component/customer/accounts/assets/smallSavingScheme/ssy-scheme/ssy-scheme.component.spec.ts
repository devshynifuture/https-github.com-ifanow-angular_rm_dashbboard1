import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SsySchemeComponent } from './ssy-scheme.component';

describe('SsySchemeComponent', () => {
  let component: SsySchemeComponent;
  let fixture: ComponentFixture<SsySchemeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SsySchemeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SsySchemeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
