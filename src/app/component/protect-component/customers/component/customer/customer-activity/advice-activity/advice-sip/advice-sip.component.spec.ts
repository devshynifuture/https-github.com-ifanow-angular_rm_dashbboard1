import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdviceSIPComponent } from './advice-sip.component';

describe('AdviceSIPComponent', () => {
  let component: AdviceSIPComponent;
  let fixture: ComponentFixture<AdviceSIPComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdviceSIPComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdviceSIPComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
