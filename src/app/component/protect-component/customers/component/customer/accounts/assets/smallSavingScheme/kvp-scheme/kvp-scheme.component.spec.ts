import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KvpSchemeComponent } from './kvp-scheme.component';

describe('KvpSchemeComponent', () => {
  let component: KvpSchemeComponent;
  let fixture: ComponentFixture<KvpSchemeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KvpSchemeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KvpSchemeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
