import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PoMisSchemeComponent } from './po-mis-scheme.component';

describe('PoMisSchemeComponent', () => {
  let component: PoMisSchemeComponent;
  let fixture: ComponentFixture<PoMisSchemeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PoMisSchemeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PoMisSchemeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
