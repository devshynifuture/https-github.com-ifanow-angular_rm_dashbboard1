import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ScripFieldComponent } from './scrip-field.component';

describe('ScripFieldComponent', () => {
  let component: ScripFieldComponent;
  let fixture: ComponentFixture<ScripFieldComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ScripFieldComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ScripFieldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
