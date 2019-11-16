import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PoTdSchemeComponent } from './po-td-scheme.component';

describe('PoTdSchemeComponent', () => {
  let component: PoTdSchemeComponent;
  let fixture: ComponentFixture<PoTdSchemeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PoTdSchemeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PoTdSchemeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
