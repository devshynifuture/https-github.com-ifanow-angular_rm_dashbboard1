import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PoRdSchemeComponent } from './po-rd-scheme.component';

describe('PoRdSchemeComponent', () => {
  let component: PoRdSchemeComponent;
  let fixture: ComponentFixture<PoRdSchemeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PoRdSchemeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PoRdSchemeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
