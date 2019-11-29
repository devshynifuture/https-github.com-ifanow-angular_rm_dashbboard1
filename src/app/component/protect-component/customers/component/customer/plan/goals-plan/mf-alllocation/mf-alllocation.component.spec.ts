import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MfAlllocationComponent } from './mf-alllocation.component';

describe('MfAlllocationComponent', () => {
  let component: MfAlllocationComponent;
  let fixture: ComponentFixture<MfAlllocationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MfAlllocationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MfAlllocationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
