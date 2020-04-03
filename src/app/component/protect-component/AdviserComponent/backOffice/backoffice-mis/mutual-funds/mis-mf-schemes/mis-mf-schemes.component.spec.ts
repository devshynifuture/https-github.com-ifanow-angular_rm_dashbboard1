import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MisMfSchemesComponent } from './mis-mf-schemes.component';

describe('MisMfSchemesComponent', () => {
  let component: MisMfSchemesComponent;
  let fixture: ComponentFixture<MisMfSchemesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MisMfSchemesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MisMfSchemesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
