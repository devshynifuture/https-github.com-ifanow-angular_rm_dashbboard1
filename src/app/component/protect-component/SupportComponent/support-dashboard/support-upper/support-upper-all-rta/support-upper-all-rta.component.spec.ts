import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SupportUpperAllRtaComponent } from './support-upper-all-rta.component';

describe('SupportUpperAllRtaComponent', () => {
  let component: SupportUpperAllRtaComponent;
  let fixture: ComponentFixture<SupportUpperAllRtaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SupportUpperAllRtaComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SupportUpperAllRtaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
