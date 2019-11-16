import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ScssSchemeComponent } from './scss-scheme.component';

describe('ScssSchemeComponent', () => {
  let component: ScssSchemeComponent;
  let fixture: ComponentFixture<ScssSchemeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ScssSchemeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ScssSchemeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
